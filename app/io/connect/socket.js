let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Update = require('../../model/update/user/users'),
    IoUtil = require('../../io/util/util'),
    RestFulUtil, {
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('../../util/Util'),
    Insert = require('../../model/add/insert/common/index'),
    UpdateInCommon = require('../../model/update/common/common'),
    DeleteInCommon = require('../../model/remove/common/common'),
    CommonFind = require('../../model/find/common/common'),
    Response = require('../../util/Response'),
    Pipeline = require('../../io/middleware/SocketIoPipeline'),
    FindInGroup = require('../../model/find/groups/group'),
    FindInChannel = require('../../model/find/channels/channel'),
    FindInUser = require('../../model/find/user/users');
require('dotenv').config();


module.exports = {
    io
}


const IN_VALID_USER_ID = 'IN_VALID_USER_ID';


let port = process.env.SOCKET_IO_PORT,
    allUsers = {};


http.listen(port, () => {
    console.log('Socket.io running...');
});


io.use(async (socket, next) => {

    let accessToken = socket.handshake.headers?.authorization;
    let apiKey = socket.handshake.query?.apiKey;

    let result = await Pipeline.accessTokenVerify(accessToken);

    if ((result !== 'TOKEN_EXP' || 'IN_VALID_TOKEN') && result) {

        let data = await Pipeline.getAccessTokenPayLoad();

        let phone = data.phoneNumber,
            userId = data.id;

        let apiKey = await Pipeline.userApiKey(phone, apiKey);

        if (apiKey) {
            let socketId = `${socket.id}`;
            allUsers[socketId] = {
                data: {
                    phone: `${phone}`,
                    userId: userId
                }
            };
            next();
        }

    }

}).on('connection', async socket => {

    let isActive = 1,
        isOnline = true,
        socketId = socket?.id,
        phone = allUsers[socketId]?.data?.phone,
        socketUserId = allUsers[socketId]?.data?.userId,
        listOfUser = allUsers[socketId]?.listOfSocketIdForPvChat,
        emitToSocket = (emitName, data) => socket.emit(emitName, data),
        emitToSpecificSocket = (where, emitName, data) => io.to(where).emit(emitName, data),
        isUndefined = (data) => !data,
        joinUserInRoom = (roomId, type) => {
            if (!socket.adapter.rooms.has(roomId + type))
                socket.join(roomId + type);
        },
        addRoomIntoListOfUserRooms = (roomId, type) => {
            if (!allUsers[socketId][type + 'Rooms'])
                allUsers[socketId][type + 'Rooms'] = [];

            let isRoomAddedInList = allUsers[socketId][type + 'Rooms']?.includes(roomId + type);

            if (!isRoomAddedInList)
                allUsers[socketId][type + 'Rooms'].push(roomId + type);
        },
        leaveUserInRoom = (roomId, type) => {
            let isRoomAddedInList = allUsers[socketId][type + 'Rooms']?.includes(roomId + type);

            if (isRoomAddedInList) {
                socket.leave(roomId + type);

                let index = allUsers[socketId][type + 'Rooms']?.indexOf(roomId);

                if (index > -1)
                    allUsers[socketId][type + 'Rooms']?.splice(index, 1);
            }
        },
        leaveUserInAllRooms = () => {
            let arrayOfRoomTypes = ['channel', 'group'];
            arrayOfRoomTypes.forEach(typeRoom => {
                allUsers[socketId][typeRoom + 'Rooms']?.forEach(item => {
                    socket.leave(item + typeRoom);
                });
            });
        };

    await Update.userOnline(phone, isActive);

    await IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline);

    socket.on('disconnect', async () => {

        leaveUserInAllRooms();

        let isOnline = false;

        await IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline)
            .then(() => delete allUsers[socketId]);

        let isActive = 0;

        await Update.userOnline(phone, isActive);

    });


    // user

    let socketOnForE2eFullAuth = async (receiverId, errEmitName) => {
        let receiverSocketId = IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers);

        if (receiverId === IN_VALID_USER_ID) {
            emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);
            return false;
        }

        let result = await FindInUser.isExistChatRoom({
            toUser: `${receiverId}`,
            fromUser: `${socketUserId}`
        });

        if (!result) {
            emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);
            return false;
        }

        return receiverSocketId;
    }


    let socketOnForE2e = (endPointName, emitName, errEmitName) => {

        socket.on(endPointName, async data => {

            let receiverId = data?.receiverId,
                senderId = data?.senderId;

            if (isUndefined(receiverId) || isUndefined(senderId))
                return emitToSocket(errEmitName, Response.HTTP_BAD_REQUEST);

            let receiverSocketId = await socketOnForE2eFullAuth(receiverId, errEmitName);

            if (!receiverSocketId)
                return;

            let userBlock = await FindInUser.isBlock(senderId, receiverId);

            if (!userBlock)
                return emitToSocket(errEmitName, Response.HTTP_FORBIDDEN);

            delete data?.receiverId;
            data['senderId'] = socketUserId;

            emitToSpecificSocket(receiverSocketId, emitName, data);

        });

    }

    socketOnForE2e('onNotificationForVoiceCall',
        'emitNotificationForVoiceCall', 'emitNotificationForVoiceCallError');

    socketOnForE2e('onVoiceCall',
        'emitVoiceCall', 'emitVoiceCallError');

    socket.on('onUserActivities', async data => {

        let type = data?.type,
            result = {
                e2e: async () => await CommonFind.getListOfUserE2esActivity(socketUserId, type).then(result => {
                    emitToSocket('emitUserActivities', result);
                }),
                group: async () => await CommonFind.getListOfUserGroupsOrChannelsActivity(socketUserId, type).then(result => {
                    emitToSocket('emitUserActivities', result);
                }),
                channel: async () => await result.group()
            };

        if (!typeof result[type] === 'function')
            return await CommonFind.getListOfUsersActivity(socketUserId).then(result => {
                emitToSocket('emitUserActivities', result);
            });


        result[type]();
    });


    socket.on('setOnListOfUsersChat', arrayOfUser => {

        let listOfUsersArray = arrayOfUser?.data;

        if (isUndefined(listOfUsersArray))
            return emitToSocket('emitListOfUserChatError', Response.HTTP_BAD_REQUEST);

        let result = IoUtil.searchAndReplaceInArrayOfUserIdToSocketId(listOfUsersArray, allUsers);

        if (result === IN_VALID_USER_ID)
            return emitToSocket('emitListOfUserChatError', Response.HTTP_NOT_FOUND);

        allUsers[socketId] = {
            listOfSocketIdForPvChat: result
        };

        let isOnline = true;
        IoUtil.sendUserOnlineStatusForSpecificUsers(result, isOnline);

    });


    socketOnForE2e('onPvTyping',
        'emitPvTyping', 'emitPvTypingError');

    let socketOnForE2eWithOutCheckUserInBlockList = (endPointName, emitName, errEmitName) => {

        socket.on(endPointName, async data => {
            let receiverId = data?.receiverId;


            if (isUndefined(receiverId))
                return emitToSocket(errEmitName, Response.HTTP_BAD_REQUEST);

            let receiverSocketId = await socketOnForE2eFullAuth(receiverId, errEmitName);

            if (!receiverSocketId)
                return;

            delete data?.receiverId;
            data['senderId'] = socketUserId;

            emitToSpecificSocket(receiverSocketId, emitName, data);

        });

    }

    socketOnForE2eWithOutCheckUserInBlockList('onPvOnlineUser',
        'emitPvOnlineUser', 'emitPvOnlineUserError');

    socketOnForE2eWithOutCheckUserInBlockList('onPvMessageSeen',
        'emitPvMessageSeen', 'emitPvMessageSeenError');


    socket.on('onPvUploadedFile', async data => {

        let receiverId = data?.receiverId,
            senderId = data?.senderId,
            id = data?.id;

        if (isUndefined(receiverId) || isUndefined(senderId) || isUndefined(id))
            return emitToSocket('emitPvUploadedFileError', Response.HTTP_BAD_REQUEST);

        let receiverSocketId = await socketOnForE2eFullAuth(receiverId, 'emitPvUploadedFileError');

        if (!receiverSocketId)
            return;

        let dbData = await FindInUser.getTableNameForListOfE2EMessage(senderId, receiverId);

        if (!dbData)
            return emitToSocket('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

        let userBlock = await FindInUser.isBlock(senderId, receiverId);

        if (!userBlock)
            return emitToSocket('emitPvUploadedFileError', Response.HTTP_FORBIDDEN);

        delete data?.receiverId;
        dbData['senderId'] = socketUserId;

        let result = await FindInUser.getDataWithId(dbData, id);

        emitToSpecificSocket(receiverSocketId, 'emitPvUploadedFile', {...result, ...data});

    });

    socket.on('onPvMessage', async data => {

        let receiverId = data?.receiverId,
            senderId = data?.senderId;

        if (isUndefined(receiverId) || isUndefined(senderId))
            return emitToSocket('emitPvMessageError', Response.HTTP_BAD_REQUEST);


        let receiverSocketId = await socketOnForE2eFullAuth(receiverId, 'emitPvMessageError');

        if (!receiverSocketId)
            return;

        let userBlock = await FindInUser.isBlock(senderId, receiverId);

        if (!userBlock)
            return emitToSocket('emitPvMessageError', Response.HTTP_FORBIDDEN);


        delete data?.receiverId;

        let message = RestFulUtil.validateMessage(data);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return emitToSocket('emitPvMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


        message['senderId'] = socketUserId;

        emitToSpecificSocket(receiverSocketId, 'emitPvMessage', message);

        await Insert.message(socketUserId + 'And' + receiverId + 'E2EContents', message, {
            conversationType: 'E2E'
        });


    });

    socket.on('onPvEditMessage', async data => {

        let receiverId = data?.receiverId,
            messageId = data?.messageId,
            senderId = data?.senderId;

        if (isUndefined(receiverId) || isUndefined(messageId) || isUndefined(senderId))
            return emitToSocket('emitPvEditMessageError', Response.HTTP_BAD_REQUEST);

        let receiverSocketId = await socketOnForE2eFullAuth(receiverId, 'emitPvEditMessageError');

        if (!receiverSocketId)
            return;

        let userBlock = await FindInUser.isBlock(senderId, receiverId);

        if (!userBlock)
            return emitToSocket('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

        let result = await FindInUser.isMessageBelongForThisUserInE2E(messageId, socketUserId,
            socketUserId + 'And' + receiverId + 'E2EContents');

        if (!result)
            return emitToSocket('emitPvEditMessageError', Response.HTTP_FORBIDDEN);


        delete data?.receiverId;
        delete data?.messageId;

        let message = RestFulUtil.validateMessage(data);


        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return emitToSocket('emitPvEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


        message['senderId'] = socketUserId;

        emitToSpecificSocket(receiverSocketId, 'emitPvEditMessage', message);

        await UpdateInCommon.message(socketUserId + 'And' + receiverId + 'E2EContents', message, {
            messageId: messageId
        });


    });


    socket.on('onPvDeleteMessage', async data => {

        let receiverId = data?.receiverId,
            listOfId = data?.listOfId;

        if (isUndefined(receiverId) || isUndefined(listOfId))
            return emitToSocket('emitPvDeleteMessageError', Response.HTTP_BAD_REQUEST);


        let receiverSocketId = await socketOnForE2eFullAuth(receiverId, 'emitPvEditMessageError');

        if (!receiverSocketId)
            return;

        let result = await FindInUser.isMessageBelongForThisUserInE2E(listOfId, socketUserId,
            socketUserId + 'And' + receiverId + 'E2EContents');

        if (!result)
            return emitToSocket('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

        delete data['receiverId'];
        data['senderId'] = socketUserId;

        emitToSpecificSocket(receiverSocketId, 'emitPvDeleteMessage', result);

        await DeleteInCommon.message(socketUserId + 'And' + receiverId + 'E2EContents', data['listOfId']);

    });


    // groups

    let validationGroupChatRoom = async (groupId, errEmitName) => {
            let result = await FindInGroup.id(groupId);

            if (!result) {
                emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);
                return false;
            }

            return true;
        },
        fullGroupValidation = async (groupId, errEmitName, socketId) => {
            let isErr = await validationGroupChatRoom(groupId, errEmitName);

            if (!isErr)
                return;

            let result = await FindInGroup.isJoined(groupId, socketId);

            if (!result) {
                emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);
                return false;
            }

            return true;
        };

    socket.on('onLeaveGroup', async data => {

        let groupId = data?.groupId;

        if (isUndefined(groupId))
            return emitToSocket('emitLeaveGroupError', Response.HTTP_BAD_REQUEST);

        let isErr = await validationGroupChatRoom(groupId, 'emitLeaveGroupError');

        if (!isErr)
            return;

        leaveUserInRoom(groupId, 'group');

    });

    socket.on('onGroupMessage', async data => {

        let groupId = data?.groupId;

        if (isUndefined(groupId))
            return emitToSocket('emitGroupMessageError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullGroupValidation(groupId, 'emitGroupMessageError', socketUserId);

        if (!isErr)
            return;

        joinUserInRoom(groupId, 'group');
        addRoomIntoListOfUserRooms(groupId, 'group');

        delete data?.groupId;

        let message = RestFulUtil.validateMessage(data);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return emitToSocket('emitGroupMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);

        message['senderId'] = socketUserId;

        await Insert.message('`' + groupId + 'GroupContents`', message, {
            conversationType: 'Group'
        });

        emitToSpecificSocket(groupId, 'emitGroupMessage', message);


    });


    socket.on('onGroupUploadedFile', async data => {

        let groupId = data?.groupId,
            id = data?.id;

        if (isUndefined(groupId) || isUndefined(id))
            return emitToSocket('emitGroupUploadedFileError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullGroupValidation(groupId, 'emitGroupUploadedFileError', socketUserId);

        if (!isErr)
            return;

        joinUserInRoom(groupId, 'group');
        addRoomIntoListOfUserRooms(groupId, 'group');

        data['senderId'] = socketUserId;
        delete data?.groupId;

        let result = await FindInGroup.getDataWithId(groupId, id);

        emitToSpecificSocket(groupId, 'emitGroupUploadedFile', {...result, ...data});

    });


    socket.on('onGroupEditMessage', async data => {

        let groupId = data?.groupId,
            messageId = data?.messageId;

        if (isUndefined(groupId) || isUndefined(messageId))
            return emitToSocket('emitGroupEditMessageError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullGroupValidation(groupId, 'emitGroupEditMessageError', socketUserId);

        if (!isErr)
            return;

        let result = await CommonFind.isMessageBelongForThisUserInRoom(messageId, socketUserId, '`' + groupId + 'GroupContents`');

        if (!result)
            return emitToSocket('emitGroupEditMessageError', Response.HTTP_FORBIDDEN);

        joinUserInRoom(groupId, 'group');
        addRoomIntoListOfUserRooms(groupId, 'group');

        delete data?.groupId;
        delete data?.messageId;

        let message = RestFulUtil.validateMessage(data);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return emitToSocket('emitGroupEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);

        message['senderId'] = socketUserId;

        await UpdateInCommon.message('`' + groupId + 'GroupContents`', message, groupId);

        emitToSpecificSocket(groupId, 'emitGroupEditMessage', message);

    });

    socket.on('onGroupDeleteMessage', async data => {

        let groupId = data?.groupId,
            lisOfId = data?.listOfId,
            messageId = data?.messageId;

        if (isUndefined(groupId) || isUndefined(messageId) || isUndefined(lisOfId))
            return emitToSocket('emitGroupDeleteMessageError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullGroupValidation(groupId, 'emitGroupDeleteMessageError', socketUserId);

        if (!isErr)
            return;

        let result = await CommonFind.isMessageBelongForThisUserInRoom(messageId, socketUserId, '`' + groupId + 'GroupContents`');

        if (!result)
            return emitToSocket('emitGroupDeleteMessageError', Response.HTTP_FORBIDDEN);

        joinUserInRoom(groupId, 'group');
        addRoomIntoListOfUserRooms(groupId, 'group');

        await DeleteInCommon.message('`' + groupId + 'GroupContents`', lisOfId);

        emitToSpecificSocket(groupId, 'emitGroupDeleteMessage', data);

    });


    socket.on('onTypingGroupMessage', async data => {

        let groupId = data?.groupId;

        if (isUndefined(groupId))
            return emitToSocket('emitGroupTypingMessageError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullGroupValidation(groupId, 'emitGroupTypingMessageError', socketUserId);

        if (!isErr)
            return;

        joinUserInRoom(groupId, 'group');
        addRoomIntoListOfUserRooms(groupId, 'group');
        emitToSpecificSocket(groupId, 'emitTypingGroupMessage', data);

    });


    // channel

    let validationChannelChatRoom = async (channelId, errEmitName) => {
            let result = await FindInChannel.id(channelId);

            if (!result) {
                emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);
                return false;
            }

            return true;
        },
        fullChannelValidation = async (channelId, errEmitName) => {

            let isErr = await validationChannelChatRoom(channelId, errEmitName);

            if (!isErr)
                return false;

            let isOwnerOrAdmin = await FindInChannel.isOwnerOrAdmin(socketUserId, channelId);

            if (!isOwnerOrAdmin) {
                emitToSocket(errEmitName, Response.HTTP_FORBIDDEN);
                return false;
            }

            let isJoined = await FindInChannel.isJoined(channelId, socketUserId);

            if (!isJoined) {
                emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);
                return false;
            }

            return true;
        };

    socket.on('onLeaveChannel', async data => {

        let channelId = data?.channelId;

        if (isUndefined(channelId))
            return socket.emit('emitLeaveChannelError', Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelChatRoom(channelId, 'emitLeaveChannelError');

        if (!isErr)
            return;

        leaveUserInRoom(channelId, 'channel');

    });

    socket.on('onChannelMessage', async data => {

        let channelId = data?.channelId;

        if (isUndefined(channelId))
            return emitToSocket('emitChannelMessageError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullChannelValidation(channelId, 'emitChannelMessageError');

        if (!isErr)
            return;

        joinUserInRoom(channelId, 'channel');
        addRoomIntoListOfUserRooms(channelId, 'channel');

        delete data?.channelId;

        let message = RestFulUtil.validateMessage(data);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return emitToSocket('emitChannelMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);

        message['senderId'] = socketUserId;

        await Insert.message('`' + channelId + 'ChannelContents`', message, {
            conversationType: 'Channel'
        });

        emitToSpecificSocket(channelId, 'emitChannelMessage', message);

    });

    socket.on('onChannelUploadedFile', async data => {

        let channelId = data?.channelId;

        if (isUndefined(channelId))
            return emitToSocket('emitChannelUploadedFileError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullChannelValidation(channelId, 'emitChannelUploadedFileError');

        if (!isErr)
            return;

        joinUserInRoom(channelId, 'channel');
        addRoomIntoListOfUserRooms(channelId, 'channel');

        delete data?.channelId;

        let result = await FindInChannel.getDataWithId(channelId);

        emitToSpecificSocket(channelId, 'emitChannelUploadedFile', {...result, ...data});

    });

    socket.on('onChannelEditMessage', async data => {

        let channelId = data?.channelId,
            messageId = data?.messageId;

        if (isUndefined(messageId) || isUndefined(channelId))
            return emitToSocket('emitChannelEditMessageError', Response.HTTP_BAD_REQUEST);


        let isErr = await fullChannelValidation(channelId, 'emitChannelEditMessageError');

        if (!isErr)
            return;

        joinUserInRoom(channelId, 'channel');
        addRoomIntoListOfUserRooms(channelId, 'channel');

        if (messageId === undefined)
            return emitToSocket('emitChannelEditMessageError', Response.HTTP_BAD_REQUEST);

        delete data?.channelId;
        delete data?.messageId;

        let message = RestFulUtil.validateMessage(data);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return emitToSocket('emitChannelEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);

        message['senderId'] = socketUserId;

        await UpdateInCommon.message('`' + channelId + 'ChannelContents`', message, messageId);

        emitToSpecificSocket(channelId, 'emitChannelEditMessage', message);

    });

    socket.on('onChannelDeleteMessage', async data => {

        let channelId = data?.channelId,
            listOfId = data?.listOfId;

        if (isUndefined(listOfId) || isUndefined(channelId))
            return emitToSocket('emitChannelDeleteMessageError', Response.HTTP_BAD_REQUEST);

        let isErr = await fullChannelValidation(channelId, 'emitChannelDeleteMessageError');

        if (!isErr)
            return;

        joinUserInRoom(channelId, 'channel');
        addRoomIntoListOfUserRooms(channelId, 'channel');

        await DeleteInCommon.message('`' + channelId + 'ChannelContents`', listOfId);
        emitToSpecificSocket(channelId, 'emitChannelDeleteMessage', data);

    });

});
let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Update = require('app/model/update/user/users'),
    IoUtil = require('app/io/util/util'),
    RestFulUtil = require('app/util/Util'),
    Insert = require('app/model/add/insert/common/index'),
    UpdateInCommon = require('app/model/update/common/common'),
    DeleteInCommon = require('app/model/remove/common/common'),
    CommonFind = require('app/model/find/common/common'),
    Response = require('app/util/Response'),
    Pipeline = require('app/io/middleware/SocketIoPipeline'),
    FindInGroup = require('app/model/find/groups/group'),
    FindInChannel = require('app/model/find/channels/channel'),
    FindInUser = require('app/model/find/user/users');
const {use} = require("express/lib/router");
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


io.use((socket, next) => {

    let accessToken = socket.handshake.headers?.authorization;
    let apiKey = socket.handshake.query?.apiKey;

    Pipeline.accessTokenVerify(accessToken, result => {

        if (result !== 'TOKEN_EXP' || 'IN_VALID_TOKEN' && result) {

            Pipeline.getAccessTokenPayLoad(data => {

                let phone = data.phoneNumber;
                let userId = data.id;

                Pipeline.userApiKey(phone, apiKey, result => {

                    if (result) {
                        let socketId = `${socket.id}`;
                        allUsers[socketId] = {
                            data: {
                                phone: `${phone}`,
                                userId: userId
                            }
                        };
                        next();
                    }

                });

            });

        }

    });

}).on('connection', socket => {

    let isActive = 1,
        isOnline = true,
        socketId = socket?.id,
        phone = allUsers[socketId]?.data?.phone,
        socketUserId = allUsers[socketId]?.data?.userId,
        listOfUser = allUsers[socketId]?.listOfSocketIdForPvChat,
        emitToSocket = (emitName, data) => socket.emit(emitName, data),
        emitToSpecificSocket = (where, emitName, data) => io.to(where).emit(emitName, data),
        isUndefined = (data) => data === undefined || typeof data === 'undefined' || data === null,
        joinUserInRoom = (roomId, type) => {
            if (socket.adapter.rooms.has(roomId + type) === false)
                socket.join(roomId + type);
        },
        addRoomIntoListOfUserRooms = (roomId, type) => {
            if (allUsers[socketId][type + 'Rooms'] === undefined)
                allUsers[socketId][type + 'Rooms'] = [];

            let isRoomAddedInList = allUsers[socketId][type + 'Rooms']?.includes(roomId + type);

            if (!isRoomAddedInList)
                allUsers[socketId][type + 'Rooms'].push(roomId + type);
        },
        leaveUserInRoom = (roomId, type) => {
            let isRoomAddedInList = allUsers[socketId][type + 'Rooms']?.includes(roomId + type);

            if (isRoomAddedInList) {
                socket.leave(roomId + type);

                let index = allUsers[socketId][type + 'Rooms']?.indexOf(5);

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
        }

    Update.userOnline(phone, isActive);

    IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline);

    socket.on('disconnect', () => {

        leaveUserInAllRooms();

        let isOnline = false;

        IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline, () => {
            delete allUsers[socketId];
        });

        let isActive = 0;

        Update.userOnline(phone, isActive);

    });


    // user

    let socketOnForE2eFullAuth = (receiverId, errEmitName, cb) => {
        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

            if (receiverId === IN_VALID_USER_ID)
                return emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);

                cb(receiverSocketId);
            });

        });
    }


    let socketOnForE2e = (endPointName, emitName, errEmitName) => {

        socket.on(endPointName, data => {
            let receiverId = data?.receiverId,
                senderId = data?.senderId;

            if (isUndefined(receiverId) || isUndefined(senderId))
                return emitToSocket(errEmitName, Response.HTTP_BAD_REQUEST);

            socketOnForE2eFullAuth(receiverId, errEmitName, receiverSocketId => {

                FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                    if (!result)
                        return emitToSocket(errEmitName, Response.HTTP_FORBIDDEN);

                    delete data?.receiverId;
                    data['senderId'] = socketUserId;

                    emitToSpecificSocket(receiverSocketId, emitName, data);

                });

            });


        });

    }

    socketOnForE2e('onNotificationForVoiceCall',
        'emitNotificationForVoiceCall', 'emitNotificationForVoiceCallError');

    socketOnForE2e('onVoiceCall',
        'emitVoiceCall', 'emitVoiceCallError');

    socket.on('onUserActivities', (data) => {
        let type = data?.type;

        if (type === 'e2e')
            return CommonFind.getListOfUserE2esActivity(socketUserId, type, result => {

                emitToSocket('emitUserActivities', result);

            });

        if (type === 'group' || 'channel')
            return CommonFind.getListOfUserGroupsOrChannelsActivity(socketUserId, type, result => {

                emitToSocket('emitUserActivities', result);

            });

        CommonFind.getListOfUsersActivity(socketUserId, result => {

            emitToSocket('emitUserActivities', result);

        });

    });


    socket.on('setOnListOfUsersChat', arrayOfUser => {

        let listOfUsersArray = arrayOfUser?.data;

        if (isUndefined(listOfUsersArray))
            return emitToSocket('emitListOfUserChatError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceInArrayOfUserIdToSocketId(listOfUsersArray, allUsers, result => {

            if (result === IN_VALID_USER_ID)
                return emitToSocket('emitListOfUserChatError', Response.HTTP_NOT_FOUND);

            allUsers[socketId] = {
                listOfSocketIdForPvChat: result
            };

            let isOnline = true;
            IoUtil.sendUserOnlineStatusForSpecificUsers(result, isOnline);
        });

    });


    socketOnForE2e('onPvTyping',
        'emitPvTyping', 'emitPvTypingError');

    let socketOnForE2eWithOutCheckUserInBlockList = (endPointName, emitName, errEmitName) => {

        socket.on(endPointName, data => {
            let receiverId = data?.receiverId;


            if (isUndefined(receiverId))
                return emitToSocket(errEmitName, Response.HTTP_BAD_REQUEST);

            socketOnForE2eFullAuth(receiverId, errEmitName, receiverSocketId => {

                delete data?.receiverId;
                data['senderId'] = socketUserId;

                emitToSpecificSocket(receiverSocketId, emitName, data);

            });

        });

    }

    socketOnForE2eWithOutCheckUserInBlockList('onPvOnlineUser',
        'emitPvOnlineUser', 'emitPvOnlineUserError');

    socketOnForE2eWithOutCheckUserInBlockList('onPvMessageSeen',
        'emitPvMessageSeen', 'emitPvMessageSeenError');


    socket.on('onPvUploadedFile', data => {
        let receiverId = data?.receiverId,
            senderId = data?.senderId,
            id = data?.id;

        if (isUndefined(receiverId) || isUndefined(senderId) || isUndefined(id))
            return emitToSocket('emitPvUploadedFileError', Response.HTTP_BAD_REQUEST);

        socketOnForE2eFullAuth(receiverId, 'emitPvUploadedFileError', receiverSocketId => {

            FindInUser.getTableNameForListOfE2EMessage(senderId, receiverId, dbData => {

                if (!dbData)
                    return emitToSocket('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

                FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                    if (!result)
                        return emitToSocket('emitPvUploadedFileError', Response.HTTP_FORBIDDEN);


                    delete data?.receiverId;
                    dbData['senderId'] = socketUserId;

                    FindInUser.getDataForE2EContentWithId(dbData, id, result => {
                        emitToSpecificSocket(receiverSocketId, 'emitPvUploadedFile', Object.assign({}, result, data));
                    });

                });

            });

        });

    });

    socket.on('onPvMessage', data => {
        let receiverId = data?.receiverId,
            senderId = data?.senderId;

        if (isUndefined(receiverId) || isUndefined(senderId))
            return emitToSocket('emitPvMessageError', Response.HTTP_BAD_REQUEST);


        socketOnForE2eFullAuth(receiverId, 'emitPvMessageError', receiverSocketId => {

            FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                if (!result)
                    return emitToSocket('emitPvMessageError', Response.HTTP_FORBIDDEN);


                delete data?.receiverId;

                RestFulUtil.validateMessage(data, result => {

                    if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                        return emitToSocket('emitPvMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                    result['senderId'] = socketUserId;

                    emitToSpecificSocket(receiverSocketId, 'emitPvMessage', result);

                    Insert.message(socketUserId + 'And' + receiverId + 'E2EContents', result, {
                        conversationType: 'E2E'
                    });

                });

            });

        });


    });

    socket.on('onPvEditMessage', data => {
        let receiverId = data?.receiverId,
            messageId = data?.messageId,
            senderId = data?.senderId;

        if (isUndefined(receiverId) || isUndefined(messageId) || isUndefined(senderId))
            return emitToSocket('emitPvEditMessageError', Response.HTTP_BAD_REQUEST);

        socketOnForE2eFullAuth(receiverId, 'emitPvEditMessageError', receiverSocketId => {

            FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                if (!result)
                    return emitToSocket('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

                FindInUser.isMessageBelongForThisUserInE2E(messageId, socketUserId,
                    socketUserId + 'And' + receiverId + 'E2EContents', result => {
                        if (!result)
                            return emitToSocket('emitPvEditMessageError', Response.HTTP_FORBIDDEN);


                        delete data?.receiverId;
                        delete data?.messageId;

                        RestFulUtil.validateMessage(data, result => {

                            if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                                return emitToSocket('emitPvEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                            result['senderId'] = socketUserId;

                            emitToSpecificSocket(receiverSocketId, 'emitPvEditMessage', result);

                            UpdateInCommon.message(socketUserId + 'And' + receiverId + 'E2EContents', result, {
                                messageId: messageId
                            });


                        });

                    });

            });

        });


    });


    socket.on('onPvDeleteMessage', data => {
        let receiverId = data?.receiverId,
            listOfId = data?.listOfId;

        if (isUndefined(receiverId) || isUndefined(listOfId))
            return emitToSocket('emitPvDeleteMessageError', Response.HTTP_BAD_REQUEST);


        socketOnForE2eFullAuth(receiverId, 'emitPvEditMessageError', receiverSocketId => {

            FindInUser.isMessageBelongForThisUserInE2E(listOfId, socketUserId,
                socketUserId + 'And' + receiverId + 'E2EContents', result => {
                    if (!result)
                        return emitToSocket('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

                    delete data['receiverId'];
                    data['senderId'] = socketUserId;

                    emitToSpecificSocket(receiverSocketId, 'emitPvDeleteMessage', result);

                    DeleteInCommon.message(socketUserId + 'And' + receiverId + 'E2EContents', data['listOfId']);


                });


        });


    });


    // groups

    let validationGroupChatRoom = (groupId, errEmitName, cb) => {

            FindInGroup.groupId(groupId, result => {

                if (!result)
                    return emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);

                cb();
            });

        },
        fullGroupValidation = (groupId, errEmitName, socketId, cb) => {
            validationGroupChatRoom(groupId, errEmitName, () => {

                FindInGroup.isJoinedInGroup(groupId, socketUserId, result => {

                    if (!result)
                        return emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);

                    cb();
                });

            });
        };

    socket.on('onLeaveGroup', data => {
        let groupId = data?.groupId;

        if (isUndefined(groupId))
            return emitToSocket('emitLeaveGroupError', Response.HTTP_BAD_REQUEST);

        validationGroupChatRoom(groupId, 'emitLeaveGroupError', () => {

            leaveUserInRoom(groupId, 'group');

        });

    });

    socket.on('onGroupMessage', data => {

        let groupId = data?.groupId;

        if (isUndefined(groupId))
            return emitToSocket('emitGroupMessageError', Response.HTTP_BAD_REQUEST);

        fullGroupValidation(groupId, 'emitGroupMessageError', socketUserId, () => {

            joinUserInRoom(groupId, 'group');
            addRoomIntoListOfUserRooms(groupId, 'group');


            delete data?.groupId;

            RestFulUtil.validateMessage(data, result => {

                if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                    return emitToSocket('emitGroupMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                result['senderId'] = socketUserId;


                Insert.message('`' + groupId + 'GroupContents`', result, {
                    conversationType: 'Group'
                });


                emitToSpecificSocket(groupId, 'emitGroupMessage', result);

            });

        });

    });


    socket.on('onGroupUploadedFile', data => {

        let groupId = data?.groupId,
            id = data?.id;

        if (isUndefined(groupId) || isUndefined(id))
            return emitToSocket('emitGroupUploadedFileError', Response.HTTP_BAD_REQUEST);

        fullGroupValidation(groupId, 'emitGroupUploadedFileError', socketUserId, () => {


            joinUserInRoom(groupId, 'group');
            addRoomIntoListOfUserRooms(groupId, 'group');

            data['senderId'] = socketUserId;
            delete data?.groupId;

            FindInGroup.getDataForGroupContentWithId(groupId, id, result => {
                emitToSpecificSocket(groupId, 'emitGroupUploadedFile', Object.assign({}, result, data));
            });


        });


    });


    socket.on('onGroupEditMessage', data => {

        let groupId = data?.groupId,
            messageId = data?.messageId;

        if (isUndefined(groupId) || isUndefined(messageId))
            return emitToSocket('emitGroupEditMessageError', Response.HTTP_BAD_REQUEST);

        fullGroupValidation(groupId, 'emitGroupEditMessageError', socketUserId, () => {

            CommonFind.isMessageBelongForThisUserInRoom(messageId, socketUserId, '`' + groupId + 'GroupContents`', result => {
                if (!result)
                    return emitToSocket('emitGroupEditMessageError', Response.HTTP_FORBIDDEN);

                joinUserInRoom(groupId, 'group');
                addRoomIntoListOfUserRooms(groupId, 'group');


                delete data?.groupId;
                delete data?.messageId;

                RestFulUtil.validateMessage(data, result => {

                    if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                        return emitToSocket('emitGroupEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                    result['senderId'] = socketUserId;

                    UpdateInCommon.message('`' + groupId + 'GroupContents`', result, groupId);

                    emitToSpecificSocket(groupId, 'emitGroupEditMessage', result);

                });


            });

        });

    });

    socket.on('onGroupDeleteMessage', data => {

        let groupId = data?.groupId,
            lisOfId = data?.listOfId,
            messageId = data?.messageId;

        if (isUndefined(groupId) || isUndefined(messageId) || isUndefined(lisOfId))
            return emitToSocket('emitGroupDeleteMessageError', Response.HTTP_BAD_REQUEST);

        fullGroupValidation(groupId, 'emitGroupDeleteMessageError', socketUserId, () => {

            CommonFind.isMessageBelongForThisUserInRoom(messageId, socketUserId, '`' + groupId + 'GroupContents`', result => {
                if (!result)
                    return emitToSocket('emitGroupDeleteMessageError', Response.HTTP_FORBIDDEN);

                joinUserInRoom(groupId, 'group');
                addRoomIntoListOfUserRooms(groupId, 'group');


                DeleteInCommon.message('`' + groupId + 'GroupContents`', lisOfId);

                emitToSpecificSocket(groupId, 'emitGroupDeleteMessage', data);

            });


        });

    });


    socket.on('onTypingGroupMessage', data => {

        let groupId = data?.groupId;

        if (isUndefined(groupId))
            return emitToSocket('emitGroupTypingMessageError', Response.HTTP_BAD_REQUEST);


        fullGroupValidation(groupId, 'emitGroupTypingMessageError', socketUserId, () => {

            joinUserInRoom(groupId, 'group');
            addRoomIntoListOfUserRooms(groupId, 'group');


            emitToSpecificSocket(groupId, 'emitTypingGroupMessage', data);

        });

    });


    // channel

    let validationChannelChatRoom = (channelId, errEmitName, cb) => {

            FindInChannel.channelId(channelId, result => {

                if (!result)
                    return emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);

                cb();
            });

        },
        fullChannelValidation = (channelId, errEmitName, cb) => {
            validationChannelChatRoom(channelId, errEmitName, () => {

                FindInChannel.isOwnerOrAdminOfChannel(socketUserId, channelId, result => {

                    if (!result)
                        return emitToSocket(errEmitName, Response.HTTP_FORBIDDEN);

                    FindInChannel.isJoinedInChannel(channelId, socketUserId, result => {

                        if (!result)
                            return emitToSocket(errEmitName, Response.HTTP_NOT_FOUND);

                        cb();
                    });

                });

            });
        };

    socket.on('onLeaveChannel', data => {
        let channelId = data?.channelId;

        if (isUndefined(channelId))
            return socket.emit('emitLeaveChannelError', Response.HTTP_BAD_REQUEST);

        validationChannelChatRoom(channelId, 'emitLeaveChannelError', () => {

            leaveUserInRoom(channelId, 'channel');

        });

    });

    socket.on('onChanelMessage', data => {

        let channelId = data?.channelId;


        if (isUndefined(channelId))
            return emitToSocket('emitChannelMessageError', Response.HTTP_BAD_REQUEST);

        fullChannelValidation(channelId, 'emitChannelMessageError', () => {

            joinUserInRoom(channelId, 'channel');
            addRoomIntoListOfUserRooms(channelId, 'channel');

            delete data?.channelId;


            RestFulUtil.validateMessage(data, result => {

                if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                    return emitToSocket('emitChannelMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                result['senderId'] = socketUserId;

                Insert.message('`' + channelId + 'ChannelContents`', result, {
                    conversationType: 'Channel'
                });

                emitToSpecificSocket(channelId, 'emitChannelMessage', result);


            });

        });

    });

    socket.on('onChanelUploadedFile', data => {

        let channelId = data?.channelId;

        if (isUndefined(channelId))
            return emitToSocket('emitChannelUploadedFileError', Response.HTTP_BAD_REQUEST);


        fullChannelValidation(channelId, 'emitChannelUploadedFileError', () => {

            joinUserInRoom(channelId, 'channel');
            addRoomIntoListOfUserRooms(channelId, 'channel');

            delete data?.channelId;

            FindInChannel.getDataForChannelContentWithId(channelId, result => {
                emitToSpecificSocket(channelId, 'emitChannelUploadedFile', Object.assign({}, result, data));
            });

        });

    });

    socket.on('onChanelEditMessage', data => {

        let channelId = data?.channelId,
            messageId = data?.messageId;

        if (isUndefined(messageId) || isUndefined(channelId))
            return emitToSocket('emitChannelEditMessageError', Response.HTTP_BAD_REQUEST);


        fullChannelValidation(channelId, 'emitChannelEditMessageError', () => {

            joinUserInRoom(channelId, 'channel');
            addRoomIntoListOfUserRooms(channelId, 'channel');

            if (messageId === undefined)
                return emitToSocket('emitChannelEditMessageError', Response.HTTP_BAD_REQUEST);

            delete data?.channelId;
            delete data?.messageId;


            RestFulUtil.validateMessage(data, result => {

                if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                    return emitToSocket('emitChannelEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                result['senderId'] = socketUserId;

                UpdateInCommon.message('`' + channelId + 'ChannelContents`', result, messageId);
                emitToSpecificSocket(channelId, 'emitChannelEditMessage', result);

            });

        });

    });

    socket.on('onChanelDeleteMessage', data => {

        let channelId = data?.channelId,
            listOfId = data?.listOfId;

        if (isUndefined(listOfId) || isUndefined(channelId))
            return emitToSocket('emitChannelDeleteMessageError', Response.HTTP_BAD_REQUEST);

        fullChannelValidation(channelId, 'emitChannelDeleteMessageError', () => {

            joinUserInRoom(channelId, 'channel');
            addRoomIntoListOfUserRooms(channelId, 'channel');

            DeleteInCommon.message('`' + channelId + 'ChannelContents`', listOfId);
            emitToSpecificSocket(channelId, 'emitChannelDeleteMessage', data);


        });


    });


});
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

                Pipeline.userApiKey(phone, apiKey.trim(), result => {

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

    let socketId = socket?.id;
    let phone = allUsers[socketId]?.data?.phone;
    let socketUserId = allUsers[socketId]?.data?.userId;
    let listOfUser = allUsers[socketId]?.listOfSocketIdForPvChat;
    let isActive = 1;
    let joinUserInRoom = (roomId, type) => {
        if (socket.adapter.rooms.has(roomId + type) === false)
            socket.join(roomId + type);
    };
    let addRoomIntoListOfUserRooms = (roomId, type) => {
        if (allUsers[socketId][type + 'Rooms'] === undefined)
            allUsers[socketId][type + 'Rooms'] = [];

        let isRoomAddedInList = allUsers[socketId][type + 'Rooms']?.includes(roomId + type);

        if (!isRoomAddedInList)
            allUsers[socketId][type + 'Rooms'].push(roomId + type);
    };
    let leaveUserInRoom = (roomId, type) => {
        let isRoomAddedInList = allUsers[socketId][type + 'Rooms']?.includes(roomId + type);

        if (isRoomAddedInList) {
            socket.leave(roomId + type);

            let index = allUsers[socketId][type + 'Rooms']?.indexOf(5);

            if (index > -1)
                allUsers[socketId][type + 'Rooms']?.splice(index, 1);
        }
    };
    let leaveUserInAllRooms = () => {
        let arrayOfRoomTypes = ['channel', 'group'];
        arrayOfRoomTypes.forEach(typeRoom => {
            allUsers[socketId][typeRoom + 'Rooms']?.forEach(item => {
                socket.leave(item + typeRoom);
            });
        });
    }

    Update.userOnline(phone, isActive);
    let isOnline = true;

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

    socket.on('onNotificationForVoiceCall', data => {

        let receiverId = data?.receiverId;
        if (receiverId === undefined || null)
            return socket.emit('emitNotificationForVoiceCallError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitNotificationForVoiceCallError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitNotificationForVoiceCallError', Response.HTTP_NOT_FOUND);

                FindInUser.isUserInListOfBlockUser(data['senderId'], receiverId, result => {
                    if (!result)
                        return socket.emit('emitNotificationForVoiceCallError', Response.HTTP_FORBIDDEN);


                    let user = allUsers[receiverId];

                    delete data?.receiverId;
                    data['senderId'] = socketUserId;

                    io.to(user).emit('emitNotificationForVoiceCall', data);

                });

            });

        });


    });

    socket.on('onVoiceCall', data => {

        let receiverId = data?.receiverId;

        if (receiverId === undefined || null)
            return socket.emit('emitVoiceCallError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitVoiceCallError', Response.HTTP_NOT_FOUND);


            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitVoiceCallError', Response.HTTP_NOT_FOUND);

                FindInUser.isUserInListOfBlockUser(data['senderId'], receiverId, result => {
                    if (!result)
                        return socket.emit('emitVoiceCallError', Response.HTTP_FORBIDDEN);

                    let user = allUsers[receiverId];

                    delete data?.receiverId;
                    data['senderId'] = socketUserId;

                    io.to(user).emit('emitVoiceCall', data);

                });

            });

        });


    });


    socket.on('onUserActivities', (data) => {
        let type = data?.type;

        if (type === 'e2e')
            return CommonFind.getListOfUserE2esActivity(socketUserId, type, result => {

                socket.emit('emitUserActivities', result);

            });

        if (type === 'group' || 'channel')
            return CommonFind.getListOfUserGroupsOrChannelsActivity(socketUserId, type, result => {

                socket.emit('emitUserActivities', result);

            });

        CommonFind.getListOfUsersActivity(socketUserId, result => {

            socket.emit('emitUserActivities', result);

        });

    });


    socket.on('setOnListOfUsersChat', arrayOfUser => {

        let listOfUsersArray = arrayOfUser?.data;

        if (listOfUsersArray === undefined || null)
            return socket.emit('emitListOfUserChatError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceInArrayOfUserIdToSocketId(listOfUsersArray, allUsers, result => {

            if (result === IN_VALID_USER_ID)
                return socket.emit('emitListOfUserChatError', Response.HTTP_NOT_FOUND);

            allUsers[socketId] = {
                listOfSocketIdForPvChat: result
            };

            let isOnline = true;
            IoUtil.sendUserOnlineStatusForSpecificUsers(result, isOnline);
        });

    });


    socket.on('onPvTyping', data => {
        let receiverId = data?.receiverId;

        if (receiverId === undefined || null)
            return socket.emit('emitPvTypingError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitPvTypingError', Response.HTTP_NOT_FOUND);


            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvTypingError', Response.HTTP_NOT_FOUND);

                FindInUser.isUserInListOfBlockUser(data['senderId'], receiverId, result => {
                    if (!result)
                        return socket.emit('emitPvTypingError', Response.HTTP_FORBIDDEN);


                    let user = allUsers[receiverId];

                    delete data?.receiverId;
                    data['senderId'] = socketUserId;

                    io.to(user).emit('emitPvTyping', data);

                });

            });

        });

    });


    socket.on('onPvOnlineUser', data => {
        let receiverId = data?.receiverId;


        if (receiverId === undefined || null)
            return socket.emit('emitPvOnlineUserError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitPvOnlineUserError', Response.HTTP_NOT_FOUND);


            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvOnlineUserError', Response.HTTP_NOT_FOUND);

                let user = allUsers[receiverId];

                delete data?.receiverId;
                data['senderId'] = socketUserId;

                io.to(user).emit('emitPvOnlineUser', data);

            });

        });

    });


    socket.on('onPvMessageSeen', data => {
        let receiverId = data?.receiverId;

        if (receiverId === undefined || null)
            return socket.emit('emitPvMessageSeenError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitPvMessageSeenError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvMessageSeenError', Response.HTTP_NOT_FOUND);

                let user = allUsers[receiverId];

                delete data?.receiverId;
                data['senderId'] = socketUserId;

                io.to(user).emit('emitPvMessageSeen', data);

            });

        });

    });


    socket.on('onPvUploadedFile', data => {
        let receiverId = data?.receiverId;
        let senderId = data?.senderId;
        let id = data?.id;

        if ((receiverId === undefined || null) || (senderId === undefined || null) || (id === undefined || null))
            return socket.emit('emitPvUploadedFileError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

                FindInUser.getTableNameForListOfE2EMessage(senderId, receiverId, dbData => {

                    if (!dbData)
                        return socket.emit('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

                    FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                        if (!result)
                            return socket.emit('emitPvUploadedFileError', Response.HTTP_FORBIDDEN);


                        let user = allUsers[receiverId];

                        delete data?.receiverId;
                        dbData['senderId'] = socketUserId;

                        FindInUser.getDataForE2EContentWithId(dbData, id, result => {
                            io.to(user).emit('emitPvUploadedFile', Object.assign({}, result, data));
                        });

                    });

                });

            });

        });

    });

    socket.on('onPvMessage', data => {
        let receiverId = data?.receiverId;
        let senderId = data?.senderId;

        if ((receiverId === undefined || null) || (senderId === undefined || null))
            return socket.emit('emitPvMessageError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

            if (receiverSocketId === IN_VALID_USER_ID)
                return socket.emit('emitPvMessageError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvMessageError', Response.HTTP_NOT_FOUND);

                FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                    if (!result)
                        return socket.emit('emitPvMessageError', Response.HTTP_FORBIDDEN);


                    let user = allUsers[receiverSocketId];
                    delete data?.receiverId;

                    RestFulUtil.validateMessage(data, result => {

                        if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                            return socket.emit('emitPvMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                        result['senderId'] = socketUserId;

                        io.to(user).emit('emitPvMessage', result);

                        Insert.message(socketUserId + 'And' + receiverId + 'E2EContents', result, {
                            conversationType: 'E2E'
                        });

                    });

                });

            });

        });


    });

    socket.on('onPvEditMessage', data => {
        let receiverId = data?.receiverId;
        let messageId = data?.messageId;
        let senderId = data?.senderId;

        if ((receiverId === undefined || null) || (messageId === undefined || null) || (senderId === undefined || null))
            return socket.emit('emitPvEditMessageError', Response.HTTP_BAD_REQUEST);

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

            if (receiverSocketId === IN_VALID_USER_ID)
                return socket.emit('emitPvEditMessageError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvEditMessageError', Response.HTTP_NOT_FOUND);

                FindInUser.isUserInListOfBlockUser(senderId, receiverId, result => {
                    if (!result)
                        return socket.emit('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

                    let user = allUsers[receiverSocketId];

                    FindInUser.isMessageBelongForThisUserInE2E(messageId, socketUserId,
                        socketUserId + 'And' + receiverId + 'E2EContents', result => {
                            if (!result)
                                return socket.emit('emitPvEditMessageError', Response.HTTP_FORBIDDEN);


                            delete data?.receiverId;
                            delete data?.messageId;

                            RestFulUtil.validateMessage(data, result => {

                                if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                                    return socket.emit('emitPvEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                                result['senderId'] = socketUserId;

                                io.to(user).emit('emitPvEditMessage', result);

                                UpdateInCommon.message(socketUserId + 'And' + receiverId + 'E2EContents', result, {
                                    messageId: messageId
                                });


                            });


                        });

                });

            });

        });


    });


    socket.on('onPvDeleteMessage', data => {
        let receiverId = data?.receiverId;
        let listOfId = data?.listOfId;

        if ((receiverId === undefined || null) || (listOfId === undefined || null))
            return socket.emit('emitPvDeleteMessageError', Response.HTTP_BAD_REQUEST);


        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

            if (receiverSocketId === IN_VALID_USER_ID)
                return socket.emit('emitPvDeleteMessageError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvDeleteMessageError', Response.HTTP_NOT_FOUND);

                FindInUser.isMessageBelongForThisUserInE2E(listOfId, socketUserId,
                    socketUserId + 'And' + receiverId + 'E2EContents', result => {
                        if (!result)
                            return socket.emit('emitPvEditMessageError', Response.HTTP_FORBIDDEN);


                        let user = allUsers[receiverSocketId];

                        delete data['receiverId'];
                        data['senderId'] = socketUserId;

                        io.to(user).emit('emitPvDeleteMessage', result);

                        DeleteInCommon.message(socketUserId + 'And' + receiverId + 'E2EContents', data['listOfId']);

                    });

            });


        });


    });


    // groups


    socket.on('onLeaveGroup', data => {
        let groupId = data?.groupId;

        if (groupId === undefined || null)
            return socket.emit('emitLeaveGroupError', Response.HTTP_BAD_REQUEST);

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitLeaveGroupError', Response.HTTP_NOT_FOUND);

            leaveUserInRoom(groupId, 'group');
        });

    });

    socket.on('onGroupMessage', data => {

        let groupId = data?.groupId;

        if (groupId === undefined || null)
            return socket.emit('emitGroupMessageError', Response.HTTP_BAD_REQUEST);

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupMessageError', Response.HTTP_NOT_FOUND);


            FindInGroup.isJoinedInGroup(groupId, socketUserId, result => {

                if (!result)
                    return socket.emit('emitGroupMessageError', Response.HTTP_NOT_FOUND);

                joinUserInRoom(groupId, 'group');
                addRoomIntoListOfUserRooms(groupId, 'group');


                delete data?.groupId;

                RestFulUtil.validateMessage(data, result => {

                    if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                        return socket.emit('emitGroupMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                    result['senderId'] = socketUserId;


                    Insert.message('`' + groupId + 'GroupContents`', result, {
                        conversationType: 'Group'
                    });


                    io.to(groupId).emit('emitGroupMessage', result);
                });


            });

        });

    });


    socket.on('onGroupUploadedFile', data => {

        let groupId = data?.groupId;
        let id = data?.id;
        if ((id === undefined || null) || (groupId === undefined || null))
            return socket.emit('emitGroupUploadedFileError', Response.HTTP_BAD_REQUEST);

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupUploadedFileError', Response.HTTP_NOT_FOUND);


            FindInGroup.isJoinedInGroup(groupId, socketUserId, result => {

                if (!result)
                    return socket.emit('emitGroupUploadedFileError', Response.HTTP_NOT_FOUND);


                joinUserInRoom(groupId, 'group');
                addRoomIntoListOfUserRooms(groupId, 'group');

                data['senderId'] = socketUserId;
                delete data?.groupId;

                FindInGroup.getDataForGroupContentWithId(groupId, id, result => {
                    io.to(groupId).emit('emitGroupUploadedFile', Object.assign({}, result, data));
                });


            });

        });


    });


    socket.on('onGroupEditMessage', data => {

        let groupId = data?.groupId;
        let messageId = data?.messageId;

        if ((messageId === undefined || null) || (groupId === undefined || null))
            return socket.emit('emitGroupEditMessageError', Response.HTTP_BAD_REQUEST);

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupEditMessageError', Response.HTTP_NOT_FOUND);


            FindInGroup.isJoinedInGroup(groupId, socketUserId, result => {

                if (!result)
                    return socket.emit('emitGroupEditMessageError', Response.HTTP_NOT_FOUND);

                CommonFind.isMessageBelongForThisUserInRoom(messageId, socketUserId, '`' + groupId + 'GroupContents`', result => {
                    if (!result)
                        return socket.emit('emitGroupEditMessageError', Response.HTTP_FORBIDDEN);

                    joinUserInRoom(groupId, 'group');
                    addRoomIntoListOfUserRooms(groupId, 'group');


                    delete data?.groupId;
                    delete data?.messageId;

                    RestFulUtil.validateMessage(data, result => {

                        if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                            return socket.emit('emitGroupEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                        result['senderId'] = socketUserId;

                        UpdateInCommon.message('`' + groupId + 'GroupContents`', result, groupId);

                        io.to(groupId).emit('emitGroupEditMessage', result);

                    });


                });

            });

        });

    });

    socket.on('onGroupDeleteMessage', data => {

        let groupId = data?.groupId;
        let lisOfId = data?.listOfId;
        let messageId = data?.messageId;

        if ((lisOfId === undefined || null) || (messageId === undefined || null) || (groupId === undefined || null))
            return socket.emit('emitGroupDeleteMessageError', Response.HTTP_BAD_REQUEST);

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupDeleteMessageError', Response.HTTP_NOT_FOUND);


            FindInGroup.isJoinedInGroup(groupId, socketUserId, result => {

                if (!result)
                    return socket.emit('emitGroupDeleteMessageError', Response.HTTP_NOT_FOUND);

                CommonFind.isMessageBelongForThisUserInRoom(messageId, socketUserId, '`' + groupId + 'GroupContents`', result => {
                    if (!result)
                        return socket.emit('emitGroupDeleteMessageError', Response.HTTP_FORBIDDEN);

                    joinUserInRoom(groupId, 'group');
                    addRoomIntoListOfUserRooms(groupId, 'group');


                    DeleteInCommon.message('`' + groupId + 'GroupContents`', lisOfId);

                    io.to(groupId).emit('emitGroupDeleteMessage', data);

                });

            });

        });

    });


    socket.on('onTypingGroupMessage', data => {

        let groupId = data?.groupId;
        if (groupId === undefined || null)
            return socket.emit('emitGroupTypingMessageError', Response.HTTP_BAD_REQUEST);

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupTypingMessageError', Response.HTTP_NOT_FOUND);


            FindInGroup.isJoinedInGroup(groupId, socketUserId, result => {

                if (!result)
                    return socket.emit('emitGroupTypingMessageError', Response.HTTP_NOT_FOUND);


                joinUserInRoom(groupId, 'group');
                addRoomIntoListOfUserRooms(groupId, 'group');


                io.to(groupId).emit('emitTypingGroupMessage', data);

            });

        });

    });


    // channel


    socket.on('onLeaveChannel', data => {
        let channelId = data?.channelId;

        if (channelId === undefined || null)
            return socket.emit('emitLeaveChannelError', Response.HTTP_BAD_REQUEST);

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitLeaveChannelError', Response.HTTP_NOT_FOUND);

            leaveUserInRoom(channelId, 'channel');
        });

    });

    socket.on('onChanelMessage', data => {

        let channelId = data?.channelId;


        if (channelId === undefined || null)
            return socket.emit('emitChannelMessageError', Response.HTTP_BAD_REQUEST);

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelMessageError', Response.HTTP_NOT_FOUND);

            FindInChannel.isOwnerOrAdminOfChannel(socketUserId, channelId, result => {

                if (!result)
                    return socket.emit('emitChannelMessageError', Response.HTTP_FORBIDDEN);

                FindInChannel.isJoinedInChannel(channelId, socketUserId, result => {

                    if (!result)
                        return socket.emit('emitChannelMessageError', Response.HTTP_NOT_FOUND);


                    joinUserInRoom(channelId, 'channel');
                    addRoomIntoListOfUserRooms(channelId, 'channel');

                    delete data?.channelId;


                    RestFulUtil.validateMessage(data, result => {

                        if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                            return socket.emit('emitChannelMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                        result['senderId'] = socketUserId;

                        Insert.message('`' + channelId + 'ChannelContents`', result, {
                            conversationType: 'Channel'
                        });

                        io.to(channelId).emit('emitChannelMessage', result);
                    });


                });

            });

        });

    });

    socket.on('onChanelUploadedFile', data => {

        let channelId = data?.channelId;

        if (channelId === undefined || null)
            return socket.emit('emitChannelUploadedFileError', Response.HTTP_BAD_REQUEST);

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelUploadedFileError', Response.HTTP_NOT_FOUND);


            FindInChannel.isOwnerOrAdminOfChannel(socketUserId, channelId, result => {

                if (!result)
                    return socket.emit('emitChannelUploadedFileError', Response.HTTP_FORBIDDEN);

                FindInChannel.isJoinedInChannel(channelId, socketUserId, result => {

                    if (!result)
                        return socket.emit('emitChannelUploadedFileError', Response.HTTP_NOT_FOUND);

                    joinUserInRoom(channelId, 'channel');
                    addRoomIntoListOfUserRooms(channelId, 'channel');

                    delete data?.channelId;

                    FindInChannel.getDataForChannelContentWithId(channelId, result => {
                        io.to(channelId).emit('emitChannelUploadedFile', Object.assign({}, result, data));
                    });


                });

            });

        });

    });

    socket.on('onChanelEditMessage', data => {

        let channelId = data?.channelId;
        let messageId = data?.messageId;

        if ((messageId === undefined || null) || (channelId === undefined || null))
            return socket.emit('emitChannelEditMessageError', Response.HTTP_BAD_REQUEST);

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelEditMessageError', Response.HTTP_NOT_FOUND);


            FindInChannel.isOwnerOrAdminOfChannel(socketUserId, channelId, result => {

                if (!result)
                    return socket.emit('emitChannelEditMessageError', Response.HTTP_FORBIDDEN);

                FindInChannel.isJoinedInChannel(channelId, socketUserId, result => {

                    if (!result)
                        return socket.emit('emitChannelEditMessageError', Response.HTTP_NOT_FOUND);

                    joinUserInRoom(channelId, 'channel');
                    addRoomIntoListOfUserRooms(channelId, 'channel');
                    if (messageId === undefined)
                        return socket.emit('emitChannelEditMessageError', Response.HTTP_BAD_REQUEST);

                    delete data?.channelId;
                    delete data?.messageId;


                    RestFulUtil.validateMessage(data, result => {

                        if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                            return socket.emit('emitChannelEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                        result['senderId'] = socketUserId;

                        UpdateInCommon.message('`' + channelId + 'ChannelContents`', result, messageId);
                        io.to(channelId).emit('emitChannelEditMessage', result);

                    });

                });

            });

        });

    });

    socket.on('onChanelDeleteMessage', data => {

        let channelId = data?.channelId;
        let listOfId = data?.listOfId;
        if ((channelId === undefined || null) || (listOfId === undefined || null))
            return socket.emit('emitChannelDeleteMessageError', Response.HTTP_BAD_REQUEST);

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelDeleteMessageError', Response.HTTP_NOT_FOUND);


            FindInChannel.isOwnerOrAdminOfChannel(socketUserId, channelId, result => {

                if (!result)
                    return socket.emit('emitChannelDeleteMessageError', Response.HTTP_FORBIDDEN);

                FindInChannel.isJoinedInChannel(channelId, socketUserId, result => {

                    if (!result)
                        return socket.emit('emitChannelDeleteMessageError', Response.HTTP_NOT_FOUND);

                    joinUserInRoom(channelId, 'channel');
                    addRoomIntoListOfUserRooms(channelId, 'channel');

                    DeleteInCommon.message('`' + channelId + 'ChannelContents`', listOfId);
                    io.to(channelId).emit('emitChannelDeleteMessage', data);


                });

            });

        });

    });


});
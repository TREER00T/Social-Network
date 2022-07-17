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
    Json = require('app/util/ReturnJson'),
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

    let accessToken = socket.handshake.headers.authorization;
    let apiKey = socket.handshake.query.apiKey;

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

    let socketId = socket.id;
    let phone = allUsers[socketId].data.phone;
    let socketUserId = allUsers[socketId].data.userId;
    let listOfUser = allUsers[socketId].listOfSocketIdForPvChat;
    let isActive = 1;

    Update.userOnline(phone, isActive);
    let isOnline = true;

    IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline);

    socket.on('disconnect', () => {


        let isOnline = false;

        IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline, () => {
            delete allUsers[socketId];
        });

        let isActive = 0;

        Update.userOnline(phone, isActive);

    });


    // user


    socket.on('onUserActivities', (type) => {
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

        let listOfUsersArray = arrayOfUser['data'];

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
        let receiverId = data['receiverId'];

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitPvTypingError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvTypingError', Response.HTTP_NOT_FOUND);

                let user = allUsers[receiverId];

                delete data['receiverId'];
                data['senderId'] = socketUserId;

                io.to(user).emit('emitPvTyping', data);

            });

        });

    });


    socket.on('onPvOnlineUser', data => {
        let receiverId = data['receiverId'];

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

                delete data['receiverId'];
                data['senderId'] = socketUserId;

                io.to(user).emit('emitPvOnlineUser', data);

            });

        });

    });


    socket.on('onPvMessageSeen', data => {
        let receiverId = data['receiverId'];

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

                delete data['receiverId'];
                data['senderId'] = socketUserId;

                io.to(user).emit('emitPvMessageSeen', data);

            });

        });

    });


    socket.on('onPvUploadedFile', data => {
        let receiverId = data['receiverId'];

        IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverId => {

            if (receiverId === IN_VALID_USER_ID)
                return socket.emit('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

            FindInUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);

                FindInUser.getTableNameForListOfE2EMessage(data['senderId'], receiverId, dbData => {

                    if (!data)
                        return socket.emit('emitPvUploadedFileError', Response.HTTP_NOT_FOUND);
                    let user = allUsers[receiverId];

                    delete data['receiverId'];
                    data['senderId'] = socketUserId;

                    FindInUser.getDataForE2EContentWithId(dbData, data['id'], result => {
                        io.to(user).emit('emitPvUploadedFile', Object.assign({}, result, data));
                    });

                });

            });

        });

    });

    socket.on('onPvMessage', data => {
        let receiverId = data['receiverId'];


        if (data !== undefined)

            IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

                if (receiverSocketId === IN_VALID_USER_ID)
                    return socket.emit('emitPvMessageError', Response.HTTP_NOT_FOUND);

                FindInUser.isExistChatRoom({
                    toUser: `${receiverId}`,
                    fromUser: `${socketUserId}`
                }, result => {

                    if (!result)
                        return socket.emit('emitPvMessageError', Response.HTTP_NOT_FOUND);

                    FindInUser.isUserInListOfBlockUser(data['senderId'], receiverId, result => {
                        if (!result)
                            return socket.emit('emitPvOnlineUserError', Response.HTTP_FORBIDDEN);


                        let user = allUsers[receiverSocketId];

                        RestFulUtil.validateMessage(data, result => {

                            if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                                return socket.emit('emitPvMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                            let toUser = data['receiverId'];
                            delete data['receiverId'];
                            data['senderId'] = socketUserId;

                            io.to(user).emit('emitPvMessage', result);

                            Insert.message(socketUserId + 'And' + toUser + 'E2EContents', data);

                        });

                    });

                });

            });


    });

    socket.on('onPvEditMessage', data => {
        let receiverId = data['receiverId'];


        if (data !== undefined)

            IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

                if (receiverSocketId === IN_VALID_USER_ID)
                    return socket.emit('emitPvEditMessageError', Response.HTTP_NOT_FOUND);

                FindInUser.isExistChatRoom({
                    toUser: `${receiverId}`,
                    fromUser: `${socketUserId}`
                }, result => {

                    if (!result)
                        return socket.emit('emitPvEditMessageError', Response.HTTP_NOT_FOUND);

                    FindInUser.isUserInListOfBlockUser(data['senderId'], receiverId, result => {
                        if (!result)
                            return socket.emit('emitPvOnlineUserError', Response.HTTP_FORBIDDEN);

                        let user = allUsers[receiverSocketId];

                        RestFulUtil.validateMessage(data, result => {

                            if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                                return socket.emit('emitPvEditMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                            let toUser = data['receiverId'];
                            delete data['receiverId'];
                            data['senderId'] = socketUserId;

                            io.to(user).emit('emitPvEditMessage', result);

                            UpdateInCommon.message(socketUserId + 'And' + toUser + 'E2EContents', data, {
                                id: data['id']
                            });

                        });

                    });

                });

            });


    });


    socket.on('onPvDeleteMessage', data => {
        let receiverId = data['receiverId'];


        if (data !== undefined)

            IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

                if (receiverSocketId === IN_VALID_USER_ID)
                    return socket.emit('emitPvDeleteMessageError', Response.HTTP_NOT_FOUND);

                FindInUser.isExistChatRoom({
                    toUser: `${receiverId}`,
                    fromUser: `${socketUserId}`
                }, result => {

                    if (!result)
                        return socket.emit('emitPvDeleteMessageError', Response.HTTP_NOT_FOUND);

                    let user = allUsers[receiverSocketId];

                    RestFulUtil.validateMessage(data, result => {

                        if (result === RestFulUtil.IN_VALID_MESSAGE_TYPE || RestFulUtil.IN_VALID_OBJECT_KEY)
                            return socket.emit('emitPvDeleteMessageError', Response.HTTP_INVALID_JSON_OBJECT_KEY);


                        let toUser = data['receiverId'];
                        delete data['receiverId'];
                        data['senderId'] = socketUserId;

                        io.to(user).emit('emitPvDeleteMessage', result);

                        DeleteInCommon.message(socketUserId + 'And' + toUser + 'E2EContents', data['listOfId']);

                    });

                });

            });


    });


    // groups

    socket.on('onGroupMessage', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInGroup.isJoinedInGroup(groupId, userId, result => {

                if (!result)
                    return socket.emit('emitGroupMessageError',
                        Json.builder(Response.HTTP_NOT_FOUND));

                if (socket.adapter.rooms.has(groupId) === false) {
                    socket.join(groupId);
                }

                Insert.message('`' + groupId + 'GroupContents`', data);
                io.to(groupId).emit('emitGroupMessage', data);

            });

        });

    });


    socket.on('onGroupUploadedFile', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupUploadedFileError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInGroup.isJoinedInGroup(groupId, userId, result => {

                if (!result)
                    return socket.emit('emitGroupUploadedFileError',
                        Json.builder(Response.HTTP_NOT_FOUND));


                if (socket.adapter.rooms.has(groupId) === false) {
                    socket.join(groupId);
                }

                FindInGroup.getDataForGroupContentWithId(groupId, data['id'], result => {
                    io.to(groupId).emit('emitGroupUploadedFile', Object.assign({}, result, data));
                });


            });

        });


    });


    socket.on('onGroupEditMessage', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupEditMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInGroup.isJoinedInGroup(groupId, userId, result => {

                if (!result)
                    return socket.emit('emitGroupEditMessageError',
                        Json.builder(Response.HTTP_NOT_FOUND));


                if (socket.adapter.rooms.has(groupId) === false) {
                    socket.join(groupId);
                }

                UpdateInCommon.message('`' + groupId + 'GroupContents`', data, data['id']);
                io.to(groupId).emit('emitGroupEditMessage', data);

            });

        });

    });

    socket.on('onGroupDeleteMessage', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupDeleteMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInGroup.isJoinedInGroup(groupId, userId, result => {

                if (!result)
                    return socket.emit('emitGroupDeleteMessageError',
                        Json.builder(Response.HTTP_NOT_FOUND));


                if (socket.adapter.rooms.has(groupId) === false) {
                    socket.join(groupId);
                }

                DeleteInCommon.message('`' + groupId + 'GroupContents`', data['listOfId']);
                io.to(groupId).emit('emitGroupDeleteMessage', data);

            });

        });

    });


    socket.on('onTypingGroupMessage', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('emitGroupTypingMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInGroup.isJoinedInGroup(groupId, userId, result => {

                if (!result)
                    return socket.emit('emitGroupTypingMessageError',
                        Json.builder(Response.HTTP_NOT_FOUND));


                if (socket.adapter.rooms.has(groupId) === false) {
                    socket.join(groupId);
                }

                io.to(groupId).emit('emitTypingGroupMessage', data);

            });

        });

    });


    // channel

    socket.on('onChanelMessage', data => {

        let channelId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInChannel.isJoinedInChannel(channelId, userId, result => {

                if (!result)
                    return socket.emit('emitChannelMessageError', Json.builder(Response.HTTP_NOT_FOUND));


                if (socket.adapter.rooms.has(channelId) === false) {
                    socket.join(channelId);
                }

                Insert.message('`' + channelId + 'ChannelContents`', data);
                io.to(channelId).emit('emitChannelMessage', data);


            });

        });

    });

    socket.on('onChanelUploadedFile', data => {

        let channelId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelUploadedFileError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInChannel.isJoinedInChannel(channelId, userId, result => {

                if (!result)
                    return socket.emit('emitChannelUploadedFileError', Json.builder(Response.HTTP_NOT_FOUND));

                if (socket.adapter.rooms.has(channelId) === false) {
                    socket.join(channelId);
                }

                FindInChannel.getDataForChannelContentWithId(channelId, data['id'], result => {
                    io.to(channelId).emit('emitChannelUploadedFile', Object.assign({}, result, data));
                });


            });

        });

    });

    socket.on('onChanelEditMessage', data => {

        let channelId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelEditMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInChannel.isJoinedInChannel(channelId, userId, result => {

                if (!result)
                    return socket.emit('emitChannelEditMessageError', Json.builder(Response.HTTP_NOT_FOUND));

                if (socket.adapter.rooms.has(channelId) === false) {
                    socket.join(channelId);
                }

                UpdateInCommon.message('`' + channelId + 'ChannelContents`', data, data['id']);
                io.to(channelId).emit('emitChannelEditMessage', data);


            });

        });

    });

    socket.on('onChanelDeleteMessage', data => {

        let channelId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindInChannel.channelId(channelId, result => {

            if (!result)
                return socket.emit('emitChannelDeleteMessageError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInChannel.isJoinedInChannel(channelId, userId, result => {

                if (!result)
                    return socket.emit('emitChannelDeleteMessageError', Json.builder(Response.HTTP_NOT_FOUND));

                if (socket.adapter.rooms.has(channelId) === false) {
                    socket.join(channelId);
                }

                DeleteInCommon.message('`' + channelId + 'ChannelContents`', data['listOfId']);
                io.to(channelId).emit('emitChannelDeleteMessage', data);


            });

        });

    });


});
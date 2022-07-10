let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Update = require('app/model/update/user/users'),
    IoUtil = require('app/io/util/util'),
    RestFulUtil = require('app/util/Util'),
    Insert = require('app/model/add/insert/common/index'),
    Response = require('app/util/Response'),
    Pipeline = require('app/io/middleware/SocketIoPipeline'),
    FindGroup = require('app/model/find/groups/group'),
    FindUser = require('app/model/find/user/users'),
    Json = require('app/util/ReturnJson'),
    FindInUser = require('app/model/find/user/users');
require('dotenv').config();


module.exports = {
    io
}


const IN_VALID_USER_ID = 'IN_VALID_USER_ID';


let port = process.env.SOCKET_IO_PORT,
    allUsers = {},
    state;


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
    let isActive = 1;

    Update.userOnline(phone, isActive);

    socket.on('disconnect', () => {

        let listOfUser = allUsers[socketId].listOfSocketIdForPvChat;

        let isOnline = false;

        IoUtil.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline, () => {
            delete allUsers[socketId];
        });

        let isActive = 0;

        Update.userOnline(phone, isActive);

    });


    // user


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

            FindUser.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${socketUserId}`
            }, result => {

                if (!result)
                    return socket.emit('emitPvTypingError', Response.HTTP_NOT_FOUND);

                let user = allUsers[receiverId];

                delete data['receiverId'];
                data['senderId'] = socketUserId;

                io.to(user).emit('isPvTyping', data);

            });

        });

    });

    socket.on('onPvMessage', data => {
        let receiverId = data['receiverId'];


        if (data !== undefined)

            IoUtil.searchAndReplaceUserIdToSocketId(receiverId, allUsers, receiverSocketId => {

                if (receiverSocketId === IN_VALID_USER_ID)
                    return socket.emit('emitPvMessageError', Response.HTTP_NOT_FOUND);

                FindUser.isExistChatRoom({
                    toUser: `${receiverId}`,
                    fromUser: `${socketUserId}`
                }, result => {

                    if (!result)
                        return socket.emit('emitPvTypingError', Response.HTTP_NOT_FOUND);

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


    // groups

    socket.on('groupInit', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        FindGroup.groupId(groupId, result => {

            if (!result)
                return socket.emit('groupInitError', Json.builder(Response.HTTP_NOT_FOUND));


            FindInUser.isGroupIdInUserList(groupId, userId, result => {

                if (!result) {
                    state['isGroupInUserList'] = false;
                    return socket.emit('groupInitError',
                        Json.builder(Response.HTTP_BAD_REQUEST));
                }

                state['isGroupInUserList'] = true;

                allUsers[socketId] = {
                    data: {
                        groupId: groupId
                    }
                };

            });

        });

    });


    // socket.on('onGroupTyping', data => {
    //     Server.io.broadcast.emit('isGroupTyping', Json.builder({
    //         'isUserTypingInGroup': data['user']
    //     }));
    // });


});
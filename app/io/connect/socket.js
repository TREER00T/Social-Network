let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Update = require('app/model/update/user/users'),
    Util = require('app/io/util/util'),
    File = require('app/io/util/File'),
    SocketUtil = require('app/io/util/util'),
    Response = require('app/util/Response'),
    Pipeline = require('app/io/middleware/SocketIoPipeline'),
    Find = require('app/model/find/group/group'),
    Json = require('app/util/ReturnJson'),
    FindInUser = require('app/model/find/user/users');
require('dotenv').config();


let port = process.env.SOCKET_IO_PORT;

http.listen(port, () => {
    console.log('Socket.io running...');
});


let allUsers = {},
    state;


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
                        socket.nickname = socketId;
                        next();
                    }

                });

            });

        }

    });

}).on('connection', socket => {

    let socketId = socket.id;
    let phone = allUsers[socketId].data.phone;
    let isActive = 1;

    Update.userOnline(phone, isActive);

    socket.on('disconnect', () => {

        let listOfUser = allUsers[socketId].listOfSocketIdForPvChat;

        let isOnline = false;

        Util.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline, () => {
            delete allUsers[socketId];
        });

        let isActive = 0;

        Update.userOnline(phone, isActive);

    });


    // user


    socket.on('setOnListOfUsersChat', arrayOfUser => {

        let listOfUsersArray = arrayOfUser['data'];

        Util.searchAndReplaceInArrayOfUserIdToSocketId(listOfUsersArray, allUsers, result => {

            allUsers[socketId] = {
                listOfSocketIdForPvChat: result
            };

            let isOnline = true;
            Util.sendUserOnlineStatusForSpecificUsers(result, isOnline);
        });

    });


    socket.on('onPvTyping', data => {
        let userId = data['userId'];

        Util.searchAndReplaceUserIdToSocketId(userId, allUsers, socketId => {

            let user = allUsers[socketId];
            io.to(user).emit('isPvTyping', {
                'isPvTyping': data['isPvTyping']
            });

        });

    });

    socket.on('onPvMessage', jsonObject => {
        let receiverId = jsonObject['receiverId'];

        Util.searchAndReplaceUserIdToSocketId(receiverId, allUsers, socketId => {
            const IN_VALID_USER_ID = 'IN_VALID_USER_ID';

            if (socketId === IN_VALID_USER_ID)
                return socket.emit('emitPvMessageError', Response.HTTP_NOT_FOUND);


            // let user = allUsersInServer[socketId];
            // let isDataBinaryNUll = jsonObject['dataBinary'] === undefined;

            // if (isDataBinaryNUll) {
            //     return pvNamespace.to(user).emit('emitPvMessage', {
            //         senderId: jsonObject['senderId'],
            //         data: jsonObject.data
            //     });
            // }
            //
            // Util.validateMessage(jsonObject, result => {
            //     // if (result !== 'IN_VALID_OBJECT_KEY')
            //         // connect database
            // });
            // File.decodeAndWriteFile(jsonObject['dataBinary'], 'Image', socket);

        });

    });


    // group

    socket.on('groupInit', data => {

        let groupId = data.id;
        let userId = allUsers[socketId].data.userId;

        Find.groupId(groupId, result => {

            if (!result) {
                return socket.emit('groupInitError',
                    Json.builder(Response.HTTP_NOT_FOUND));
            }

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

    // let isGroupInUserList = state['isGroupInUserList'];
    // let groupId = allUsersInServer[socket.id].data.groupId;
    //
    // if (isGroupInUserList)
    //     socket.join(groupId)


    // socket.on('onGroupTyping', data => {
    //     Server.io.broadcast.emit('isGroupTyping', Json.builder({
    //         'isUserTypingInGroup': data['user']
    //     }));
    // });


});
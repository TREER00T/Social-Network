let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Update = require('app/model/update/user/users'),
    Util = require('app/io/util/util'),
    Pipeline = require('app/io/middleware/SocketIoPipeline');

require('dotenv').config();
require('app/io/Interface');


let port = process.env.SOCKET_IO_PORT;

http.listen(port, () => {
    console.log('Socket.io running...');
});

let allUsers = {};

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


    socket.on('setOnListOfUsersChat', arrayOfUser => {

        let listOfUsersArray = arrayOfUser['data'];

        Util.searchAndReplaceUserIdToSocketId(listOfUsersArray, allUsers, result => {
            allUsers[socketId] = {
                listOfSocketIdForPvChat: result
            };
            let isOnline = true;
            Util.sendUserOnlineStatusForSpecificUsers(result, isOnline);
        });

    });


    socket.on('disconnect', () => {

        let listOfUser = allUsers[socketId].listOfSocketIdForPvChat;

        let isOnline = false;
        Util.sendUserOnlineStatusForSpecificUsers(listOfUser, isOnline, () => {
            delete allUsers[socketId];
        });

        let isActive = 0;

        Update.userOnline(phone, isActive);

    });

});


module.exports = {
    io,
    allUsers: allUsers
};
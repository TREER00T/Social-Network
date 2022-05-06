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
let userData = {};

io.use((socket, next) => {

    let accessToken = socket.handshake.headers.authorization;
    let apiKey = socket.handshake.query.apiKey;


    Pipeline.accessTokenVerify(accessToken, result => {

        if (typeof result !== 'object' || result !== 'IN_VALID_TOKEN')

            Pipeline.getAccessTokenPayLoad(data => {

                let phone = data.phoneNumber;
                let userId = data.id;

                userData['phone'] = phone;
                userData['id'] = userId;

                Pipeline.userApiKey(phone, apiKey.trim(), result => {

                    if (result) {
                        let userId = `${socket.id}`;
                        allUsers[userId] = phone;
                        socket.nickname = data;
                        next();
                    }

                });

            });

    });

}).on('connection', socket => {

    let socketId = socket.id;
    let phone = userData.phone;
    let isActive = 1;

    Update.userOnline(phone, isActive);


    socket.on('setOnListOfUsersChat', arrayOfUser => {

        let listOfUsersArray = arrayOfUser['data'];

        allUsers[socketId] = {listOfPvChat: listOfUsersArray};

    });


    socket.on('disconnect', () => {


        delete allUsers[socketId];

        let isActive = 0;


        Update.userOnline(phone, isActive);

        // io.to(socketid).emit('message', 'whatever');
        // io.socket.broadcast.emit('userOffline');

    });

});


module.exports = {
    io,
    allUsers: allUsers,
    user: userData
};
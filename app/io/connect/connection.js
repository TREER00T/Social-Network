let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
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


    Pipeline.accessTokenVerify(accessToken, (result) => {

        if (typeof result !== 'object' || result !== 'IN_VALID_TOKEN')

            Pipeline.getAccessTokenPayLoad((data) => {

                let phone = data.phoneNumber;

                Pipeline.userApiKey(phone, apiKey, (result) => {

                    if (result) {
                        let userId = `${socket.id}`;
                        allUsers[userId] = phone;
                        socket.nickname = data;
                        next();
                    }

                });

            });

    });

}).on('connection', (socket) => {

    socket.on('disconnect', () => {

        let userId = socket.id;
        delete allUsers[userId];

    });

});


module.exports = {
    io,
    allUsers
};
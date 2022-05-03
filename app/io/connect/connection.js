let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

require('dotenv').config();
require('app/io/Interface');


let port = process.env.SOCKET_IO_PORT;

http.listen(port, () => {
    console.log('Socket.io running...');
});

module.exports = {
    io
};
let Server = require('app/io/connect/connection'),
    Json = require('app/util/ReturnJson');

Server.io.on('connection', socket => {

    socket.on('onStartTyping', date => {
        socket.broadcast.emit('isTyping', Json.builder({
            'is': true
        }));
    });

    socket.on('onStopTyping', date => {
        socket.broadcast.emit('isTyping', Json.builder({
            'is': false
        }));
    });

});
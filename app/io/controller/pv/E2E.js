let Server = require('app/io/connect/connection');

Server.io.on('connection', (socket) => {

    socket.on('onPvTyping', date => {
        socket.broadcast.emit('isPvTyping', Json.builder({
            'isPvTyping': date['isPvTyping']
        }));
    });

});
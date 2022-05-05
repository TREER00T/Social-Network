let Server = require('app/io/connect/connection'),
    Json = require('app/util/ReturnJson');

Server.io.on('connection', (socket) => {

    socket.on('onPvTyping', date => {
        socket.broadcast.emit('isPvTyping', Json.builder({
            'isPvTyping': date['isPvTyping']
        }));
    });

});
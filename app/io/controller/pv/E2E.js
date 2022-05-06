let Server = require('app/io/connect/connection'),
    Json = require('app/util/ReturnJson');

let allUsers = Server.allUsers;


Server.io.on('connection', (socket) => {

    socket.on('onPvTyping', data => {
        let to = data['to'];
        let user = allUsers[to];
        socket.to(user).emit('isPvTyping', Json.builder({
            'isPvTyping': data['isPvTyping']
        }));
    });


});
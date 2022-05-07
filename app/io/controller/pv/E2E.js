let Server = require('app/io/connect/connection'),
    Util = require('app/io/util/util');

let allUsersInServer = Server.allUsers,
    pvNamespace = Server.io.of('/pv');


pvNamespace.on('connection', socket => {


    socket.on('onPvTyping', data => {
        let userId = data['userId'];

        Util.searchAndReplaceUserIdToSocketId(userId, allUsersInServer, socketId => {

            let user = allUsersInServer[socketId];
            pvNamespace.to(user).emit('isPvTyping', {
                'isPvTyping': data['isPvTyping']
            });

        });

    });


    socket.on('onPvMessage', data => {
        let userId = data['userId'];

        Util.searchAndReplaceUserIdToSocketId(userId, allUsersInServer, socketId => {
            let user = allUsersInServer[socketId];

            pvNamespace.to(user).emit('emitPvMessage', data);

        });

    });


});
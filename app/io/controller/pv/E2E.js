let Server = require('app/io/connect/connection'),
    Util = require('app/io/util/util');

let allUsersInServer = Server.allUsers,
    pvNamespace = Server.io.of('/pv'),
    File = require('app/io/util/File');


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

    socket.on('onPvMessage', jsonObject => {
        let receiverId = jsonObject['receiverId'];

        Util.searchAndReplaceUserIdToSocketId(receiverId, allUsersInServer, socketId => {
            let user = allUsersInServer[socketId];
            let isDataBinaryNUll = jsonObject['dataBinary'] === undefined;

            if (isDataBinaryNUll) {
                return pvNamespace.to(user).emit('emitPvMessage', {
                    senderId: jsonObject['senderId'],
                    data: jsonObject.data
                });
            }

            Util.validateMessage(jsonObject.data, result => {
                if (result !== 'IN_VALID_OBJECT_KEY')
                    let fullPath = File.decodeAndWriteFile(jsonObject['dataBinary'], jsonObject.data.type, socket);

                // connect database
            });

        });

    });


});
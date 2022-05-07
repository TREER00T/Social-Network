let Server = require('app/io/connect/connection'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Find = require('app/model/find/group/group'),
    FindInUser = require('app/model/find/user/users');

let allUsersTyping = {},
    state = {},
    allUsersInServer = Server.allUsers;

Server.io.on('connection', (socket) => {

    let socketId = socket.id;

    socket.on('groupInit', data => {

        let groupId = data.id;
        let userId = allUsersInServer[socketId].data.userId;

        Find.groupId(groupId, result => {

            if (!result) {
                return socket.emit('groupInitError',
                    Json.builder(Response.HTTP_NOT_FOUND));
            }

            FindInUser.isGroupIdInUserList(groupId, userId, result => {

                if (!result) {
                    state['isGroupInUserList'] = false;
                    return socket.emit('groupInitError',
                        Json.builder(Response.HTTP_BAD_REQUEST));
                }

                state['isGroupInUserList'] = true;

                allUsersInServer[socket.id] = {
                    data: {
                        groupId: groupId
                    }
                };

            });

        });

    });

    let isGroupInUserList = state['isGroupInUserList'];
    let groupId = allUsersInServer[socket.id].data.groupId;

    if (isGroupInUserList)
        socket.join(groupId)


    // socket.on('onGroupTyping', data => {
    //     Server.io.broadcast.emit('isGroupTyping', Json.builder({
    //         'isUserTypingInGroup': data['user']
    //     }));
    // });

});

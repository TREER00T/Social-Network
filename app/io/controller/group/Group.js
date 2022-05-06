let Server = require('app/io/connect/connection'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Find = require('app/model/find/group/group'),
    FindInUser = require('app/model/find/user/users');

let allUsersTyping = {},
    state = {},
    allUsersInServer = Server.allUsers;

Server.io.on('connection', (socket) => {

    socket.on('groupInit', date => {

        let groupId = date.id;
        let userId = Server.user.id;

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
                        phone: Server.user.phone,
                        groupId: 'groupId',
                        userId: userId
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

let Server = require('app/io/connect/connection'),
    Json = require('app/util/ReturnJson');

module.exports = {

    searchAndReplaceUserIdToSocketId(arrayOfUsersId, users, cb) {
        let listOfUsersSocketId = [];
        arrayOfUsersId.forEach((item) => {

            for (let socketId in users) {
                let userId = users[socketId].data.userId;

                if (userId === item)
                    listOfUsersSocketId.push(
                        {
                            userId: userId,
                            socketId: socketId

                        }
                    );
            }

        });
        cb(listOfUsersSocketId);
    },

    sendUserOnlineStatusForSpecificUsers(arr, isOnline,cb) {
        arr.forEach((item, index) => {
            Server
                .io.to(item[index].socketId).emit('onlineStatus', Json.builder({
                userId: item[index].userId,
                isOnline: isOnline
            }));
        });
    }

}



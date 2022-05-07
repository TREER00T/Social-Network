let Server = require('app/io/connect/connection');

module.exports = {

    searchAndReplaceInArrayOfUserIdToSocketId(arrayOfUsersId, users, cb) {
        let listOfUsersSocketId = [];

        if (arrayOfUsersId?.length === 0)
            return cb(listOfUsersSocketId);

        arrayOfUsersId.forEach(item => {

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


    searchAndReplaceUserIdToSocketId(userIdData, users, cb) {
        let realSocketId = '';

        for (let socketId in users) {
            let userId = users[socketId].data.userId;

            if (userId === userIdData)
                realSocketId = socketId;

        }

        cb(realSocketId);
    },


    sendUserOnlineStatusForSpecificUsers(arr, isOnline, cb) {

        if (arr !== undefined && arr?.length !== 0) {

            arr.forEach((item, index) => {

                Server.io.to(item[index].socketId).emit('onlineStatus', {
                    userId: item[index].userId,
                    isOnline: isOnline
                });

            });

        }

    }

}



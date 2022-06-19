let Server = require('app/io/connect/socket');

module.exports = {

    searchAndReplaceInArrayOfUserIdToSocketId(arrayOfUsersId, users, cb) {
        let listOfUsersSocketId = [];
        let isArrayNull = arrayOfUsersId?.length === 0;

        if (isArrayNull)
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
        let isNullResponse = listOfUsersSocketId.length === 0;
        if (isNullResponse)
            return cb('IN_VALID_USER_ID');

        cb(listOfUsersSocketId);
    },


    searchAndReplaceUserIdToSocketId(userIdData, users, cb) {
        let realSocketId = '';

        for (let socketId in users) {
            let userId = users[socketId].data.userId;

            if (userId === userIdData)
                realSocketId = socketId;

        }

        let isNullResponse = realSocketId === '';
        if (isNullResponse)
            return cb('IN_VALID_USER_ID');

        cb(realSocketId);
    },


    sendUserOnlineStatusForSpecificUsers(arr, isOnline) {

        let isArrayNull = arr?.length === 0;

        if (arr !== undefined && !isArrayNull) {

            arr.forEach((item, index) => {

                Server.io.to(item[index].socketId).emit('onlineStatus', {
                    userId: item[index].userId,
                    isOnline: isOnline
                });

            });

        }

    }

}
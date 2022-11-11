let Server = require('../../io/connect/socket');



module.exports = {

    searchAndReplaceInArrayOfUserIdToSocketId(arrayOfUsersId, users) {
        let listOfUsersSocketId = [];
        let isArrayNull = arrayOfUsersId?.length === 0;

        if (isArrayNull)
            return listOfUsersSocketId;

        arrayOfUsersId.forEach(item => {

            for (let socketId in users) {
                let userId = users[socketId].data.userId;

                if (userId === item)
                    listOfUsersSocketId.push({
                            userId: userId,
                            socketId: socketId
                    });
            }

        });

        let isNullResponse = listOfUsersSocketId.length === 0;
        if (isNullResponse)
            return 'IN_VALID_USER_ID';

        return listOfUsersSocketId;
    },


    searchAndReplaceUserIdToSocketId(userIdData, users) {
        let realSocketId = '';

        for (let socketId in users) {
            let userId = users[socketId].data.userId;

            if (userId === userIdData)
                realSocketId = socketId;
        }

        if (!realSocketId)
            return 'IN_VALID_USER_ID';

        return realSocketId;
    },


    async sendUserOnlineStatusForSpecificUsers(arr, isOnline) {

        let isArrayNull = arr?.length === 0;

        if (arr !== undefined && !isArrayNull) {

            for (const item of arr) {
                const index = arr.indexOf(item);

               await Server.io.to(item[index].socketId).emit('onlineStatus', {
                    userId: item[index].userId,
                    isOnline: isOnline
                });

            }

        }

    }

}
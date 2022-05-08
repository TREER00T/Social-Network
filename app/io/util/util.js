let Server = require('app/io/connect/connection');

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


    validateMessage(jsonObject, cb) {

        let arrayOfValidJsonObjectKey = [
            'text', 'type', 'isReply', 'fileUrl', 'fileSize', 'senderId',
            'fileName', 'isForward', 'targetReplyId', 'forwardDataId'
        ];

        let arrayOfMessageType = [
            'None', 'Image', 'Location', 'Document', 'Video', 'Voice'
        ];


        let isTypeInMessageType = arrayOfMessageType.includes(jsonObject.type);


        if (!isTypeInMessageType) {
            cb('IN_VALID_MESSAGE_TYPE');
            return;
        }


        for (let key in jsonObject) {
            let isValidObjectKey = arrayOfValidJsonObjectKey.includes(key);

            if (!isValidObjectKey) {
                cb('IN_VALID_OBJECT_KEY');
                return;
            }

        }


        const MESSAGE_WITHOUT_FILE = 'None';
        let isReplyInJsonObject = jsonObject.isReply === true;
        let isForwardInJsonObject = jsonObject.isForward === true;
        let isNoneMessageType = jsonObject.type === MESSAGE_WITHOUT_FILE;
        let isMessageTypeNull = jsonObject.type?.length === 0 || undefined || null;
        let isFileUrlNull = jsonObject.fileUrl?.length === 0 || null;
        let isTextNull = jsonObject.fileUrl?.length === 0 || null;
        let isFileSizeNull = jsonObject.fileSize?.length === 0 || null;
        let isFileNameNull = jsonObject.fileName?.length === 0 || null;
        let isSenderIdNull = jsonObject.senderId?.length === 0 || null;


        if (isMessageTypeNull) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (!isMessageTypeNull && !isNoneMessageType &&
            !isFileUrlNull && !isFileSizeNull && !isFileNameNull) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isTextNull){
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isSenderIdNull) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (!isMessageTypeNull)
            jsonObject.type = MESSAGE_WITHOUT_FILE;


        if (isReplyInJsonObject)
            jsonObject.isReply = 1;


        if (isForwardInJsonObject)
            jsonObject.isForward = 1;


        cb(jsonObject);
    },


    sendUserOnlineStatusForSpecificUsers(arr, isOnline, cb) {

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
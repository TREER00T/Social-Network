let Server = require('app/io/connect/socket'),
    {
        NULL
    } = require('app/database/util/SqlKeyword');

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


    validateMessage(jsonObject, cb) {

        let arrayOfValidJsonObjectKey = [
            'text', 'type', 'isReply', 'fileName', 'receiverId', 'isForward', 'fileFormat',
            'targetReplyId', 'forwardDataId', 'locationLat', 'locationLon'
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
        const MESSAGE_TYPE_LOCATION = 'Location';
        let isReplyInJsonObject = jsonObject.isReply === true;
        let isForwardInJsonObject = jsonObject.isForward === true;
        let isNoneMessageType = jsonObject.type === MESSAGE_WITHOUT_FILE;
        let isMessageTypeLocation = jsonObject.type === MESSAGE_TYPE_LOCATION;
        let isMessageTypeNull = jsonObject.type?.length === 0 || undefined || null;
        let isTextNull = jsonObject.text?.length === 0 || null;
        let isFileNameNull = jsonObject.fileName?.length === 0 || null;
        let isFileFormatNull = jsonObject.filFormat?.length === 0 || null;
        let isSenderIdNull = jsonObject.senderId?.length === 0 || null;
        let isLocationLatNull = jsonObject.locationLat?.length === 0 || null;
        let isLocationLonNull = jsonObject.locationLon?.length === 0 || null;


        if (isMessageTypeLocation || isLocationLonNull || isLocationLatNull) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isMessageTypeNull) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isMessageTypeNull && !isNoneMessageType && !isFileFormatNull &&
            !isFileNameNull && !isMessageTypeLocation) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isTextNull && isNoneMessageType) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isSenderIdNull) {
            cb('IN_VALID_OBJECT_KEY');
            return;
        }


        if (isTextNull && !isNoneMessageType)
            jsonObject.text = NULL;


        if (isMessageTypeNull)
            jsonObject.type = MESSAGE_WITHOUT_FILE;


        if (isReplyInJsonObject)
            jsonObject.isReply = 1;


        if (isForwardInJsonObject)
            jsonObject.isForward = 1;

        jsonObject.isUploading = 1;

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
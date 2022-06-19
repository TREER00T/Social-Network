let {
    NULL
} = require('app/database/util/SqlKeyword');


module.exports = {


    formatBytes(realSize) {

        const decimalLength = 2,
            packetSize = 1024;

        let d = Math.floor(Math.log(realSize) / Math.log(packetSize));

        return 0 === realSize ? '0 Bytes' :
            parseFloat((realSize / Math.pow(packetSize, d)).toFixed(Math.max(0, decimalLength))) +
            ' ' + ['Bytes', 'KB', 'MB', 'GB'][d];

    },


    getRandomHexColor() {

        let letters = '0123456789ABCDEF'.split(''),
            color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }

        return color;
    },


    getFileFormat(fileName) {
        return fileName.match(/\.[0-9a-z]+$/i)[0].toLowerCase();
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

}
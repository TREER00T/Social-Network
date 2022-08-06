let {
        NULL
    } = require('opensql').queryHelper,
    {
        POINT
    } = require('opensql').fieldHelper;


const IN_VALID_MESSAGE_TYPE = 'IN_VALID_MESSAGE_TYPE',
    IN_VALID_OBJECT_KEY = 'IN_VALID_OBJECT_KEY';


module.exports = {

    IN_VALID_OBJECT_KEY: IN_VALID_OBJECT_KEY,
    IN_VALID_MESSAGE_TYPE: IN_VALID_MESSAGE_TYPE,

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
            'text', 'type', 'isReply', 'isForward',
            'targetReplyId', 'forwardDataId', 'locationLat', 'locationLon', 'senderId'
        ];

        let arrayOfMessageType = [
            'None', 'Image', 'Location', 'Document', 'Video', 'Voice'
        ];


        let isTypeInMessageType = arrayOfMessageType.includes(jsonObject.type);


        if (!isTypeInMessageType) {
            cb(IN_VALID_MESSAGE_TYPE);
            return;
        }


        for (let key in jsonObject) {
            let isValidObjectKey = arrayOfValidJsonObjectKey.includes(key);

            if (!isValidObjectKey) {
                cb(IN_VALID_OBJECT_KEY);
                return;
            }

        }


        const MESSAGE_WITHOUT_FILE = 'None';
        const MESSAGE_TYPE_LOCATION = 'Location';
        let isReplyInJsonObject = jsonObject?.isReply !== false && undefined && null;
        let isForwardInJsonObject = jsonObject?.isForward !== false && undefined && null;
        let isNoneMessageType = jsonObject?.type === MESSAGE_WITHOUT_FILE;
        let isMessageTypeLocation = jsonObject?.type === MESSAGE_TYPE_LOCATION;
        let isMessageTypeNull = jsonObject?.type?.length === 0 || undefined || null;
        let isTextNull = jsonObject?.text?.length === 0 || null || undefined;
        let isSenderIdNull = jsonObject?.senderId?.length === 0 || null || undefined;
        let isLocationLatNull = jsonObject?.locationLat?.length === 0 || null || undefined;
        let isLocationLonNull = jsonObject?.locationLon?.length === 0 || null || undefined;


        if (isMessageTypeLocation && (isLocationLonNull || isLocationLatNull)) {
            cb(IN_VALID_OBJECT_KEY);
            return;
        }


        if (isMessageTypeNull) {
            cb(IN_VALID_OBJECT_KEY);
            return;
        }


        if (isMessageTypeNull && !isNoneMessageType && !isMessageTypeLocation) {
            cb(IN_VALID_OBJECT_KEY);
            return;
        }


        if (isTextNull && isNoneMessageType) {
            cb(IN_VALID_OBJECT_KEY);
            return;
        }


        if (isSenderIdNull) {
            cb(IN_VALID_OBJECT_KEY);
            return;
        }


        if (isMessageTypeLocation && !isLocationLonNull && !isLocationLatNull) {
            jsonObject.location = POINT(jsonObject.locationLat, jsonObject.locationLon);
            delete jsonObject.locationLat;
            delete jsonObject.locationLon;
        }


        if (isTextNull && !isNoneMessageType)
            jsonObject.text = NULL;


        if (isTextNull && isMessageTypeNull)
            jsonObject.text = 'Image';


        if (isMessageTypeNull && !isTextNull)
            jsonObject.type = MESSAGE_WITHOUT_FILE;


        if (isReplyInJsonObject)
            jsonObject.isReply = 1;

        if (!isReplyInJsonObject)
            jsonObject.isReply = 0;


        if (isForwardInJsonObject)
            jsonObject.isForward = 1;

        if (!isForwardInJsonObject)
            jsonObject.isForward = 0;


        cb(jsonObject);
    },


    splitRoute(str) {
        if (typeof str === 'string')
            return str.split('/')

        if (str.fast_slash)
            return '';

        let isMatch = str.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);

        return isMatch[1].replace(/\\(.)/g, '$1').split('/');
    }

}
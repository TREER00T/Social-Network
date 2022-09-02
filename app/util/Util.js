let {
        NULL
    } = require('opensql').queryHelper,
    {
        POINT
    } = require('opensql').fieldHelper;


let IN_VALID_MESSAGE_TYPE = 'IN_VALID_MESSAGE_TYPE',
    IN_VALID_OBJECT_KEY = 'IN_VALID_OBJECT_KEY';


module.exports = {

    IN_VALID_OBJECT_KEY: IN_VALID_OBJECT_KEY,
    IN_VALID_MESSAGE_TYPE: IN_VALID_MESSAGE_TYPE,

    formatBytes(realSize) {

        const DECIMAL_LENGTH = 2,
            PACKET_SIZE = 1024;

        let formatTypeOfFileSize = Math.floor(Math.log(realSize) / Math.log(PACKET_SIZE));

        return 0 === realSize ?
            '0 Byte' :
            parseFloat((realSize / Math.pow(PACKET_SIZE, formatTypeOfFileSize))
                .toFixed(Math.max(0, DECIMAL_LENGTH))) + ' ' +
            ['Bytes', 'KB', 'MB', 'GB'][formatTypeOfFileSize];
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
                'text', 'type',
                'isReply', 'isForward',
                'targetReplyId', 'forwardDataId',
                'locationLat', 'locationLon', 'senderId'
            ],
            arrayOfMessageType = [
                'None', 'Image',
                'Video', 'Voice',
                'Location', 'Document'
            ],
            isTypeInMessageType = arrayOfMessageType.includes(jsonObject.type);


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


        const MESSAGE_WITHOUT_FILE = 'None',
            MESSAGE_TYPE_LOCATION = 'Location';

        let isUndefined = (data) => {
                return data === false || data === undefined ||
                    typeof data === 'undefined' || data === null || data?.length === 0;
            },
            isReplyInJsonObject = !isUndefined(jsonObject?.isReply),
            isForwardInJsonObject = !isUndefined(jsonObject?.isForward),
            isNoneMessageType = jsonObject?.type === MESSAGE_WITHOUT_FILE,
            isMessageTypeLocation = jsonObject?.type === MESSAGE_TYPE_LOCATION,
            isMessageTypeNull = isUndefined(jsonObject?.type),
            isTextNull = isUndefined(jsonObject?.text),
            isSenderIdNull = isUndefined(jsonObject?.senderId),
            isLocationLatNull = isUndefined(jsonObject?.locationLat),
            isLocationLonNull = isUndefined(jsonObject?.locationLon);


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
            jsonObject.type = 'Image';


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
            return str.split('/');

        if (str.fast_slash)
            return '';

        let isMatch = str.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);

        return isMatch[1].replace(/\\(.)/g, '$1').split('/');
    }

}
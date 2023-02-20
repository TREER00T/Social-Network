import Validation from "../util/Validation";
import {JsonObject} from "./Types";
import Find from "../model/find/user";

let tokenPayload,
    IN_VALID_MESSAGE_TYPE = "IN_VALID_MESSAGE_TYPE",
    IN_VALID_OBJECT_KEY = "IN_VALID_OBJECT_KEY";

export default {

    IN_VALID_OBJECT_KEY: IN_VALID_OBJECT_KEY,
    IN_VALID_MESSAGE_TYPE: IN_VALID_MESSAGE_TYPE,

    validateMessage(jsonObject) {

        let arrayOfValidJsonObjectKey = [
                'text', 'type',
                'isReply', 'isForward',
                'targetReplyId', 'forwardDataId',
                'locationLat', 'locationLon',
                'messageCreatedBySenderId', 'messageSentRoomId'
            ],
            arrayOfMessageType = [
                'None', 'Image',
                'Video', 'Voice',
                'Location', 'Document'
            ],
            isTypeInMessageType = arrayOfMessageType.includes(jsonObject?.type);

        if (jsonObject?.forwardDataId || jsonObject?.isForward) {
            jsonObject.type = 'Forward';
            jsonObject.isReply = false;
            jsonObject.isForward = true;

            delete jsonObject?.text;
            delete jsonObject?.locationLat;
            delete jsonObject?.locationLon;
            delete jsonObject?.targetReplyId;
        }

        if (!isTypeInMessageType)
            return IN_VALID_MESSAGE_TYPE;


        for (let key in jsonObject) {
            let isValidObjectKey = arrayOfValidJsonObjectKey.includes(key);

            if (!isValidObjectKey)
                return IN_VALID_OBJECT_KEY;
        }

        let isFile = jsonObject?.type !== 'None' && jsonObject?.type !== 'Location' && isTypeInMessageType;

        if (isFile) {
            delete jsonObject?.locationLon;
            delete jsonObject?.locationLat;
        }

        const MESSAGE_WITHOUT_FILE = 'None',
            MESSAGE_TYPE_LOCATION = 'Location';

        let haveReplyId = jsonObject?.isReply,
            haveForwardId = jsonObject?.isForward,
            isNoneMessageType = jsonObject?.type === MESSAGE_WITHOUT_FILE,
            isMessageTypeLocation = jsonObject?.type === MESSAGE_TYPE_LOCATION,
            haveMessageType = jsonObject?.type,
            haveText = jsonObject?.text,
            haveLocationLat = jsonObject?.locationLat,
            haveLocationLon = jsonObject?.locationLon;

        if ((isMessageTypeLocation && (!haveLocationLon || !haveLocationLat)) || !haveMessageType ||
            (!haveMessageType && !isNoneMessageType && !isMessageTypeLocation) || (!haveText && isNoneMessageType))
            return IN_VALID_OBJECT_KEY;

        if (isMessageTypeLocation && haveLocationLon && haveLocationLat) {
            jsonObject.location = [jsonObject.locationLat, jsonObject.locationLon];
            delete jsonObject.locationLat;
            delete jsonObject.locationLon;
        }

        jsonObject.type = haveText && isNoneMessageType ? MESSAGE_WITHOUT_FILE : jsonObject?.type ? jsonObject?.type : 'Image';

        jsonObject.isReply = haveReplyId ?? false;

        jsonObject.isForward = haveForwardId ?? false;

        return jsonObject;
    },


    formatBytes(realSize: number): string {

        const DECIMAL_LENGTH = 2,
            PACKET_SIZE = 1024;

        let formatTypeOfFileSize = Math.floor(Math.log(realSize) / Math.log(PACKET_SIZE));

        return 0 === realSize ?
            "0 Byte" :
            parseFloat((realSize / Math.pow(PACKET_SIZE, formatTypeOfFileSize))
                .toFixed(Math.max(0, DECIMAL_LENGTH))) + " " +
            ["Bytes", "KB", "MB", "GB"][formatTypeOfFileSize];
    },


    getRandomHexColor(): string {
        let letters = "0123456789ABCDEF".split(""),
            color = "#";

        for (let i = 0; i < 6; i++)
            color += letters[Math.round(Math.random() * 15)];


        return color;
    },


    getFileFormat(fileName: string): string {
        return fileName.match(/\.[0-9a-z]+$/i)[0].toLowerCase();
    },

    isUndefined(data): boolean {
        if (typeof data === 'object' && Array.isArray(data))
            return data?.length < 1;

        if (typeof data === 'object')
            return false;

        return !data;
    },

    isNotEmptyArr(data): boolean {
        return data?.length > 0;
    },

    async tokenVerify(bearerHeader: string, res) {
        let token = await this.handleToken(bearerHeader, res);

        tokenPayload = token;

        return token;
    },

    async isAccessToken(bearerHeader: string, res?) {
        let token = await this.handleToken(bearerHeader, res);

        if (!token)
            return false;

        tokenPayload = token;

        return token.type === "at";
    },

    async handleToken(bearerHeader: string, res?) {
        let isSetUserToken = Validation.getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserToken !== "string")
            return false;

        return await Validation.getJwtVerify(await Validation.getJwtDecrypt(isSetUserToken, res), res);
    },

    async getTokenPayLoad(): Promise<JsonObject> {
        return tokenPayload;
    },

    async isValidApiKey(phone: string, key: string) {
        return await Find.getApiKey(phone) === key;
    }

};
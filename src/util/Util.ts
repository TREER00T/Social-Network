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
                'messageId', 'roomId',
                'messageCreatedBySenderId', 'messageSentRoomId',
                'roomType'
            ],
            arrayOfMessageType = [
                'None', 'Image',
                'Video', 'Voice',
                'Location', 'Document'
            ],
            isTypeInMessageType = arrayOfMessageType.includes(jsonObject?.type);


        if (!isTypeInMessageType)
            return IN_VALID_MESSAGE_TYPE;


        for (let key in jsonObject) {
            let isValidObjectKey = arrayOfValidJsonObjectKey.includes(key);

            if (!isValidObjectKey)
                return IN_VALID_OBJECT_KEY;
        }


        const MESSAGE_WITHOUT_FILE = 'None',
            MESSAGE_TYPE_LOCATION = 'Location';

        let haveReplyId = jsonObject?.isReply,
            haveForwardId = jsonObject?.isForward,
            isFile = jsonObject?.type !== 'None' && jsonObject?.type !== 'Location' && isTypeInMessageType,
            isNoneMessageType = jsonObject?.type === MESSAGE_WITHOUT_FILE,
            isMessageTypeLocation = jsonObject?.type === MESSAGE_TYPE_LOCATION,
            haveMessageType = jsonObject?.type,
            haveRoomId = jsonObject?.roomId,
            haveText = jsonObject?.text,
            haveSenderId = jsonObject?.messageCreatedBySenderId,
            haveLocationLat = jsonObject?.locationLat,
            haveLocationLon = jsonObject?.locationLon;

        if (isFile) {
            delete jsonObject?.locationLon;
            delete jsonObject?.forwardDataId;
            delete jsonObject?.isForward;
            delete jsonObject?.locationLat;
        }

        if ((isMessageTypeLocation && (!haveLocationLon || !haveLocationLat)) || !haveMessageType || (!haveSenderId && haveRoomId) ||
            (!haveMessageType && !isNoneMessageType && !isMessageTypeLocation) || (!haveText && isNoneMessageType))
            return IN_VALID_OBJECT_KEY;

        if (isMessageTypeLocation && haveLocationLon && haveLocationLat) {
            jsonObject.location = [jsonObject.locationLat, jsonObject.locationLon];
            delete jsonObject.locationLat;
            delete jsonObject.locationLon;
        }

        jsonObject.type = haveText ? jsonObject?.type ? jsonObject?.type : 'Image' : MESSAGE_WITHOUT_FILE;

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
        if (typeof data === "number" || typeof data === "boolean" || typeof data === "bigint")
            return true;
        return !data || data?.length < 1;
    },

    isNotEmptyArr(data): boolean {
        return data?.length > 0;
    },

    async tokenVerify(bearerHeader: string) {
        let token = await this.handleToken(bearerHeader);

        tokenPayload = token;

        return token;
    },

    async isAccessToken(bearerHeader: string) {
        let token = await this.handleToken(bearerHeader);

        if (!token)
            return false;

        tokenPayload = token;

        return token.type === "at";
    },

    async handleToken(bearerHeader: string) {
        let isSetUserToken = Validation.getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserToken !== "string")
            return false;

        return await Validation.getJwtVerify(await Validation.getJwtDecrypt(isSetUserToken));
    },

    async getTokenPayLoad(): Promise<JsonObject> {
        return tokenPayload;
    },

    async isValidApiKey(phone: string, key: string) {
        return await Find.getApiKey(phone) === key;
    }

};
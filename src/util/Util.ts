import Validation from "../util/Validation";
import {JsonObject} from "./Types";
import Find from "../model/find/user";

let tokenPayload,
    apiKey,
    IN_VALID_MESSAGE_TYPE = "IN_VALID_MESSAGE_TYPE",
    IN_VALID_OBJECT_KEY = "IN_VALID_OBJECT_KEY";

export default {

    IN_VALID_OBJECT_KEY: IN_VALID_OBJECT_KEY,
    IN_VALID_MESSAGE_TYPE: IN_VALID_MESSAGE_TYPE,

    validateMessage(jsonObject) {

        let arrayOfValidJsonObjectKey = [
                "text", "type",
                "isReply", "isForward",
                "targetReplyId", "forwardDataId",
                "locationLat", "locationLon",
                "senderId", "id",
                "receiverId", "channelId",
                "groupId"
            ],
            arrayOfMessageType = [
                "None", "Image",
                "Video", "Voice",
                "Location", "Document"
            ],
            isTypeInMessageType = arrayOfMessageType.includes(jsonObject.type);


        if (!isTypeInMessageType)
            return IN_VALID_MESSAGE_TYPE;


        for (let key in jsonObject) {
            let isValidObjectKey = arrayOfValidJsonObjectKey.includes(key);

            if (!isValidObjectKey)
                return IN_VALID_OBJECT_KEY;
        }


        const MESSAGE_WITHOUT_FILE = "None",
            MESSAGE_TYPE_LOCATION = "Location";

        let isUndefined = (data) => {
                return !data || data?.length === 0;
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


        if ((isMessageTypeLocation && (isLocationLonNull || isLocationLatNull)) || isMessageTypeNull || isSenderIdNull ||
            (isMessageTypeNull && !isNoneMessageType && !isMessageTypeLocation) || (isTextNull && isNoneMessageType))
            return IN_VALID_OBJECT_KEY;

        if (isMessageTypeLocation && !isLocationLonNull && !isLocationLatNull) {
            jsonObject.location = [jsonObject.locationLat, jsonObject.locationLon];
            delete jsonObject.locationLat;
            delete jsonObject.locationLon;
        }

        jsonObject.type = isTextNull ? "Image" : MESSAGE_WITHOUT_FILE;

        jsonObject.isReply = isReplyInJsonObject ? 1 : 0;

        jsonObject.isForward = isForwardInJsonObject ? 1 : 0;

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

        if (!token)
            return false;

        return tokenPayload = token;
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

        let decodeToken = await Validation.getJwtDecrypt(isSetUserToken)
            .then(async decode => Validation.getJwtVerify(await decode));

        return decodeToken;
    },

    async getTokenPayLoad(): Promise<JsonObject> {
        return await tokenPayload;
    },

    async isValidApiKey(phone: string, key: string) {
        if (!key)
            return false;

        let result = await Find.getApiKey(phone);

        apiKey = result;

        return result === key;
    }

};
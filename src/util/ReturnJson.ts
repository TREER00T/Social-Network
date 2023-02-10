import {Response} from "express";
import {IResponse} from "./Types";
import {CUSTOM_HTTP_CODE} from './CustomHttpCode';

// instance of response object express
let res: Response;

export default {

    builder(obj: IResponse, data?: any, option?: object) {
        let jsonContent = JSON.parse(JSON.stringify(this.jsonObject(obj, data, option)));
        if (!res)
            return jsonContent;
        res.status(CUSTOM_HTTP_CODE.includes(obj.statusCode) ? 200 : obj.statusCode);
        return jsonContent;
    },

    initializationRes(response: Response) {
        res = response;
    },

    jsonObject(obj: IResponse, data?: any, option?: object) {
        let objectBuilder = {
            statusCode: obj.statusCode,
            message: obj.message,
            data: data
        };

        if (option)
            return data ? {
                ...objectBuilder,
                option: option
            } : obj;

        return data ? objectBuilder : obj;
    }

};
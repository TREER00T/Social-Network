import {Response} from "express";
import {IResponse} from "./Types";

// instance of response object express
let res: Response;

export default {

    builder(obj: IResponse, data?: any, option?: object) {
        let jsonContent = JSON.parse(JSON.stringify(this.jsonObject(obj, data, option)));
        if (!res)
            return jsonContent;
        res.status(obj.statusCode);
        return jsonContent;
    },

    initializationRes(response: Response) {
        res = response;
    },

    jsonObject(obj: IResponse, data?: any, option?: object) {
        let objectBuilder = {
            code: obj.statusCode,
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
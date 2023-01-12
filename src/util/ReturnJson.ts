import {Response} from "express";
import {IResponse} from "./Types";

// instance of response object express
let res: Response;

export default {

    builder(obj: IResponse, data?: any, option?: object) {
        if (!res)
            return;
        let jsonContent = JSON.parse(JSON.stringify(this.jsonObject(obj, data, option)));
        res.status(obj.code);
        res.send(jsonContent);
    },

    initializationRes(response: Response) {
        res = response;
    },

    jsonObject(obj: IResponse, data?: any, option?: object) {

        let objectBuilder = {
            code: obj.code,
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
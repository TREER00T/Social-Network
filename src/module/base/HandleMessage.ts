import {User} from "./User";

let Find = require("../../model/find/user");

export abstract class HandleMessage extends User {

    async getListOfMessageCount(tableName: string, limit: number) {
        return Math.ceil(await Find.getCountOfListMessage(tableName) / limit);
    }

    async getListOfMessage(tableName: string, obj: any) {
        return await Find.getListOfMessage({
            ...obj,
            tableName: tableName
        });
    }

}
import {Injectable} from "@nestjs/common";

let CommonFind = require("../../model/find/common");

@Injectable()
export class CommonService {

    async listOfUserActivity(userId: string, type: string) {
        return await CommonFind.getListOfUserGroupsChannelsOrE2EsActivity(userId, type);
    }

    async getAllActivity(userId: string) {
        return await CommonFind.getListOfUsersActivity(userId);
    }

}

import {Injectable} from "@nestjs/common";
import CommonFind from "../../../model/find/common";

@Injectable()
export class RoomsService {

    async listOfUserActivity(userId: string, type: string) {
        return await CommonFind.getListOfUserGroupsChannelsOrE2EsActivity(userId, type);
    }

    async getAllActivity(userId: string) {
        return await CommonFind.getListOfUsersActivity(userId);
    }

}

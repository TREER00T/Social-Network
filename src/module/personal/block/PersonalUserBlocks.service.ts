import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";
import {ListOfUserTargetId} from "../../../util/Types";

@Injectable()
export class PersonalUserBlocksService {
    async listOfBlockedUsers(userId: string) {
        return await Find.getListOfBlockedUsers(userId);
    }

    async userDetails(listOfUserId: ListOfUserTargetId) {
        return await Find.getUserDetailsInUsersTable(listOfUserId);
    }
}

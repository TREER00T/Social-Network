import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

@Injectable()
export class PersonalUserBlocksService {
    async listOfBlockedUsers(userId: string) {
        return await Find.getListOfBlockedUsers(userId);
    }
}

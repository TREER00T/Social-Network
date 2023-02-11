import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";
import {UserIdWithType} from "../../../util/Types";

@Injectable()
export class E2EUserInfoService {
    async userInfo(userId: string | UserIdWithType) {
        return await Find.getUserPvDetails(userId);
    }
}

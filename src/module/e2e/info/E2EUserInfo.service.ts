import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

@Injectable()
export class E2EUserInfoService {
    async userInfo(userId: string) {
        return await Find.getUserPvDetails(userId);
    }
}

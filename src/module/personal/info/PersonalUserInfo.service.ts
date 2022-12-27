import {Injectable} from '@nestjs/common';
import Find from '../../../model/find/user';

@Injectable()
export class PersonalUserInfoService {
    async userInfo(userId: string) {
        return await Find.getPersonalUserDetails(userId);
    }
}

import {Injectable} from '@nestjs/common';

let Find =require('../../../model/find/user');

@Injectable()
export class PersonalUserInfoService {
    async userInfo(userId: string) {
        return await Find.getPersonalUserDetails(userId);
    }
}

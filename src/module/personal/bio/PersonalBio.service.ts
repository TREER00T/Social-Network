import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/user");

@Injectable()
export class PersonalBioService {
    async updateBio(userPhone: string, bio: string) {
        return await Update.bio(userPhone, bio);
    }
}

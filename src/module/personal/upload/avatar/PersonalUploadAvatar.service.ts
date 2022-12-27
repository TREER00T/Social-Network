import {Injectable} from '@nestjs/common';

let Update = require("../../../../model/update/user");

@Injectable()
export class PersonalUploadAvatarService {
    async updateAvatar(userPhone: string, avatarUrl: string) {
        await Update.img(userPhone, avatarUrl);
    }
}

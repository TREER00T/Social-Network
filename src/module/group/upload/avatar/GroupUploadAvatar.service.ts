import {Injectable} from '@nestjs/common';

let Update = require("../../../../model/update/group");

@Injectable()
export class GroupUploadAvatarService {
    async updateAvatar(groupId: string, avatarUrl: string) {
        await Update.img(groupId, avatarUrl);
    }
}

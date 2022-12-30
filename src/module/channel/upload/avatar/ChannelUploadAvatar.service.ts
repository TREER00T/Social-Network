import {Injectable} from '@nestjs/common';

let Update = require("../../../../model/update/channel");

@Injectable()
export class ChannelUploadAvatarService {
    async updateAvatar(channelId: string, avatarUrl: string) {
        await Update.img(channelId, avatarUrl);
    }
}

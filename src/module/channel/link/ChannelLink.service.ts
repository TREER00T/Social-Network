import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/channel"),
    Find = require("../../../model/find/channel");

@Injectable()
export class ChannelLinkService {
    async updateInviteLink(channelId: string, link: string) {
        await Update.inviteLink(channelId, link);
    }

    async updatePublicLink(channelId: string, link: string) {
        await Update.publicLink(channelId, link);
    }

    async hasExistPublicLink(link: string) {
        return await Find.isPublicKeyUsed(link);
    }
}

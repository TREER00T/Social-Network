import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/channel";

let Update = require("../../../model/update/channel");

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

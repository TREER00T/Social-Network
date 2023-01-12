import {Injectable} from '@nestjs/common';
import Generate from "../../../util/Generate";
import Util from "../../../util/Util";
import Insert from "../../../model/add/channel";
import InsertInUser from "../../../model/add/user";

let Create = require("../../../model/create/channel");

@Injectable()
export class CreateChannelService {
    async createChannelAndReturnId(channelName: string, avatarUrl?: string) {
        return await Insert.channel(channelName.toString().trim(), Generate.makeIdForInviteLink(), Util.getRandomHexColor(), avatarUrl);
    }

    async createChannelContent(userId: string, channelId: string) {
        await Create.channelContent(channelId);
        await Insert.admin(userId, channelId, 1);
        await Insert.user(userId, channelId);
        await InsertInUser.channelIntoListOfUserChannels(channelId, userId);
    }
}

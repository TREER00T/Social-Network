import {Injectable} from '@nestjs/common';
import DeleteInUser from "../../../model/remove/user";

let Delete = require("../../../model/remove/channel");

@Injectable()
export class DeleteChannelService {
    async removeChannel(channelId: string) {
        await Delete.channelContent(channelId);
        await Delete.channel(channelId);
        await Delete.admins(channelId);
        await Delete.users(channelId);
        await DeleteInUser.channelInListOfUserChannel(channelId);
    }
}

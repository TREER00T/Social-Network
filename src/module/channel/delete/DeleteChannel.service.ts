import {Injectable} from '@nestjs/common';

let Delete = require("../../../model/remove/channel"),
    DeleteInUser = require("../../../model/remove/user");

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

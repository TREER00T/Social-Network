import {Injectable} from '@nestjs/common';

let Insert = require("../../../model/add/channel"),
    Delete = require("../../../model/remove/channel");

@Injectable()
export class ChannelAdminService {
    async addAdmin(channelId: string, targetUserId: string) {
        await Insert.admin(targetUserId, channelId, 0);
    }

    async removeAdmin(channelId: string, targetUserId: string) {
        await Delete.admin(channelId, targetUserId);
    }
}

import {Injectable} from '@nestjs/common';
import Insert from "../../../model/add/channel";

let Delete = require("../../../model/remove/channel");

@Injectable()
export class ChannelAdminService {
    async addAdmin(channelId: string, targetUserId: string) {
        await Insert.admin(targetUserId, channelId, 0);
    }

    async removeAdmin(channelId: string, targetUserId: string) {
        await Delete.admin(channelId, targetUserId);
    }
}

import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/channel");

@Injectable()
export class ChannelInfoService {
    async channelInfo(channelId: string) {
        return await Find.getInfo(channelId);
    }

    async countOfUsersInChannel(channelId: string) {
        return await Find.getCountOfUsers(channelId);
    }
}

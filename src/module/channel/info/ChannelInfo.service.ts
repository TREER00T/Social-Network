import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/channel";

@Injectable()
export class ChannelInfoService {
    async channelInfo(channelId: string, isOwnerOrAdmin: boolean) {
        return await Find.getInfo(channelId, isOwnerOrAdmin);
    }

    async countOfUsersInChannel(channelId: string) {
        return await Find.getCountOfUsers(channelId);
    }
}

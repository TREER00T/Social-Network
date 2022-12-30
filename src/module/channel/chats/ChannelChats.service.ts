import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

@Injectable()
export class ChannelChatsService {
    async getChannelNameFromListOfUserChannels(channelId: string, userId: string) {
        return await Find.getTableNameForListOfUserChannels(channelId, userId);
    }
}

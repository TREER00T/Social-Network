import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/channel");

@Injectable()
export class ChannelDescriptionService {
    async updateDescription(description: string, channelId: string) {
        await Update.description(channelId, description);
    }
}

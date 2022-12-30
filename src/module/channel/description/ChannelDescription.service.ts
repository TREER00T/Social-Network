import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/channel");

@Injectable()
export class ChannelDescriptionService {
    async updateDescription(description: string, channelId) {
        await Update.description(channelId, description);
    }
}

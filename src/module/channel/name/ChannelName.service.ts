import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/channel");

@Injectable()
export class ChannelNameService {
    async updateName(name: string, channelId: string) {
        await Update.name(channelId, name.toString().trim());
    }
}

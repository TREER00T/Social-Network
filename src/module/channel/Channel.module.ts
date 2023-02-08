import {Module} from "@nestjs/common";
import {ChannelController} from "./Channel.controller";
import {ChannelService} from "./Channel.service";

@Module({
    controllers: [ChannelController],
    providers: [ChannelService]
})
export class ChannelModule {
}

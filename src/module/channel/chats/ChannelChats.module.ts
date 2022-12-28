import {Module} from "@nestjs/common";
import {ChannelChatsController} from "./ChannelChats.controller";
import {ChannelChatsService} from "./ChannelChats.service";

@Module({
    controllers: [ChannelChatsController],
    providers: [ChannelChatsService]
})
export class ChannelChatsModule {
}

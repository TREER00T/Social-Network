import {Module} from "@nestjs/common";
import {ChannelNameController} from "./ChannelName.controller";
import {ChannelNameService} from "./ChannelName.service";

@Module({
    controllers: [ChannelNameController],
    providers: [ChannelNameService]
})
export class ChannelNameModule {
}

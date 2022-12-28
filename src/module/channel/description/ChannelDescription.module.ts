import {Module} from "@nestjs/common";
import {ChannelDescriptionController} from "./ChannelDescription.controller";
import {ChannelDescriptionService} from "./ChannelDescription.service";

@Module({
    controllers: [ChannelDescriptionController],
    providers: [ChannelDescriptionService]
})
export class ChannelDescriptionModule {
}

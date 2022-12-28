import {Module} from "@nestjs/common";
import {DeleteChannelController} from "./DeleteChannel.controller";
import {DeleteChannelService} from "./DeleteChannel.service";

@Module({
    controllers: [DeleteChannelController],
    providers: [DeleteChannelService]
})
export class DeleteChannelModule {
}

import {Module} from "@nestjs/common";
import {ChannelUserController} from "./ChannelUser.controller";
import {ChannelUserService} from "./ChannelUser.service";

@Module({
    controllers: [ChannelUserController],
    providers: [ChannelUserService]
})
export class ChannelUserModule {
}

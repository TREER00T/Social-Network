import {Module} from "@nestjs/common";
import {ChannelUploadAvatarController} from "./ChannelUploadAvatar.controller";
import {ChannelUploadAvatarService} from "./ChannelUploadAvatar.service";

@Module({
    controllers: [ChannelUploadAvatarController],
    providers: [ChannelUploadAvatarService]
})
export class ChannelUploadAvatarModule {
}

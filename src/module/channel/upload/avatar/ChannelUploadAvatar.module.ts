import { Module } from "@nestjs/common";
import { ChannelUploadAvatarController } from "./ChannelUploadAvatar.controller";
import { ChannelUploadAvatarService } from "./ChannelUploadAvatar.service";

@Module({
  imports: [],
  controllers: [ChannelUploadAvatarController],
  providers: [ChannelUploadAvatarService]
})
export class ChannelUploadAvatarModule {
}

import { Module } from "@nestjs/common";
import { GroupUploadAvatarController } from "./GroupUploadAvatar.controller";
import { GroupUploadAvatarService } from "./GroupUploadAvatar.service";

@Module({
  imports: [],
  controllers: [GroupUploadAvatarController],
  providers: [GroupUploadAvatarService]
})
export class GroupUploadAvatarModule {
}

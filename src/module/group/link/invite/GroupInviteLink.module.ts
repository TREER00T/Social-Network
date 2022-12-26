import { Module } from "@nestjs/common";
import { GroupInviteLinkController } from "./GroupInviteLink.controller";
import { GroupInviteLinkService } from "./GroupInviteLink.service";

@Module({
  imports: [],
  controllers: [GroupInviteLinkController],
  providers: [GroupInviteLinkService]
})
export class GroupInviteLinkModule {
}

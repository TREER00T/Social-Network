import { Module } from "@nestjs/common";
import { ChannelInviteLinkController } from "./ChannelInviteLink.controller";
import { ChannelInviteLinkService } from "./ChannelInviteLink.service";

@Module({
  imports: [],
  controllers: [ChannelInviteLinkController],
  providers: [ChannelInviteLinkService]
})
export class ChannelInviteLinkModule {
}

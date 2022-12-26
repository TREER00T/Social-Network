import { Module } from "@nestjs/common";
import { ChannelPublicLinkController } from "./ChannelPublicLink.controller";
import { ChannelPublicLinkService } from "./ChannelPublicLink.service";

@Module({
  imports: [],
  controllers: [ChannelPublicLinkController],
  providers: [ChannelPublicLinkService]
})
export class ChannelPublicLinkModule {
}

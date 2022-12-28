import { Module } from "@nestjs/common";
import { ChannelLinkController } from "./ChannelLink.controller";
import { ChannelLinkService } from "./ChannelLink.service";

@Module({
  imports: [],
  controllers: [ChannelLinkController],
  providers: [ChannelLinkService]
})
export class ChannelLinkModule {
}

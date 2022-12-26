import { Module } from "@nestjs/common";
import { ChannelInfoController } from "./ChannelInfo.controller";
import { ChannelInfoService } from "./ChannelInfo.service";

@Module({
  imports: [],
  controllers: [ChannelInfoController],
  providers: [ChannelInfoService]
})
export class ChannelInfoModule {
}

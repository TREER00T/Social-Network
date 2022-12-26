import { Module } from "@nestjs/common";
import { ChannelUserJoinController } from "./ChannelUserJoin.controller";
import { ChannelUserJoinService } from "./ChannelUserJoin.service";

@Module({
  imports: [],
  controllers: [ChannelUserJoinController],
  providers: [ChannelUserJoinService]
})
export class ChannelUserJoinModule {
}

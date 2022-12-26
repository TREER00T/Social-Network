import { Module } from "@nestjs/common";
import { ChannelUserLeaveController } from "./ChannelUserLeave.controller";
import { ChannelUserLeaveService } from "./ChannelUserLeave.service";

@Module({
  imports: [],
  controllers: [ChannelUserLeaveController],
  providers: [ChannelUserLeaveService]
})
export class ChannelUserLeaveModule {
}

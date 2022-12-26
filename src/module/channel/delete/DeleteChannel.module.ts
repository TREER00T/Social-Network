import { Module } from "@nestjs/common";
import { DeleteChannelController } from "./DeleteChannel.controller";
import { DeleteChannelService } from "./DeleteChannel.service";

@Module({
  imports: [],
  controllers: [DeleteChannelController],
  providers: [DeleteChannelService]
})
export class DeleteChannelModule {
}

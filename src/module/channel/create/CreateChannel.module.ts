import { Module } from "@nestjs/common";
import { CreateChannelController } from "./CreateChannel.controller";
import { CreateChannelService } from "./CreateChannel.service";

@Module({
  imports: [],
  controllers: [CreateChannelController],
  providers: [CreateChannelService]
})
export class CreateChannelModule {
}

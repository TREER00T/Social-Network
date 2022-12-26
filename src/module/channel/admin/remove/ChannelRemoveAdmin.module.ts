import { Module } from "@nestjs/common";
import { ChannelRemoveAdminController } from "./ChannelRemoveAdmin.controller";
import { ChannelRemoveAdminService } from "./ChannelRemoveAdmin.service";

@Module({
  imports: [],
  controllers: [ChannelRemoveAdminController],
  providers: [ChannelRemoveAdminService]
})
export class ChannelRemoveAdminModule {
}

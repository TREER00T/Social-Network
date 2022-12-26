import { Module } from "@nestjs/common";
import { ChannelAddAdminController } from "./ChannelAddAdmin.controller";
import { ChannelAddAdminService } from "./ChannelAddAdmin.service";

@Module({
  imports: [],
  controllers: [ChannelAddAdminController],
  providers: [ChannelAddAdminService]
})
export class ChannelAddAdminModule {
}

import { Module } from "@nestjs/common";
import { ChannelAdminController } from "./ChannelAdmin.controller";
import { ChannelAdminService } from "./ChannelAdmin.service";

@Module({
  imports: [],
  controllers: [ChannelAdminController],
  providers: [ChannelAdminService]
})
export class ChannelAdminModule {
}

import { Module } from "@nestjs/common";
import { ChannelUsersController } from "./ChannelUsers.controller";
import { ChannelUsersService } from "./ChannelUsers.service";

@Module({
  imports: [],
  controllers: [ChannelUsersController],
  providers: [ChannelUsersService]
})
export class ChannelUsersModule {
}

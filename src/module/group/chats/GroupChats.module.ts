import { Module } from "@nestjs/common";
import { GroupChatsController } from "./GroupChats.controller";
import { GroupChatsService } from "./GroupChats.service";

@Module({
  imports: [],
  controllers: [GroupChatsController],
  providers: [GroupChatsService]
})
export class GroupChatsModule {
}

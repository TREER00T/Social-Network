import { Module } from "@nestjs/common";
import { E2EChatsController } from "./E2EChats.controller";
import { E2EChatsService } from "./E2EChats.service";

@Module({
  imports: [],
  controllers: [E2EChatsController],
  providers: [E2EChatsService]
})
export class E2EChatsModule {
}

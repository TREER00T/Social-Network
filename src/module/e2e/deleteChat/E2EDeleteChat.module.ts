import { Module } from "@nestjs/common";
import { E2EDeleteChatController } from "./E2EDeleteChat.controller";
import { E2EDeleteChatService } from "./E2EDeleteChat.service";

@Module({
  imports: [],
  controllers: [E2EDeleteChatController],
  providers: [E2EDeleteChatService]
})
export class E2EDeleteChatModule {
}

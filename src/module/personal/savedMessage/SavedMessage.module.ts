import { Module } from "@nestjs/common";
import { SavedMessageController } from "./SavedMessage.controller";
import { SavedMessageService } from "./SavedMessage.service";

@Module({
  imports: [],
  controllers: [SavedMessageController],
  providers: [SavedMessageService]
})
export class SavedMessageModule {
}

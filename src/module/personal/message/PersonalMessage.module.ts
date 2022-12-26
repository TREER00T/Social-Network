import { Module } from "@nestjs/common";
import { PersonalMessageController } from "./PersonalMessage.controller";
import { PersonalAccount } from "./PersonalMessage.service";

@Module({
  imports: [],
  controllers: [PersonalMessageController],
  providers: [PersonalAccount]
})
export class PersonalMessageModule {
}

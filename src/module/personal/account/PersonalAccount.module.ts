import { Module } from "@nestjs/common";
import { PersonalAccountController } from "./PersonalAccount.controller";
import { PersonalAccount } from "./PersonalAccount.service";

@Module({
  imports: [],
  controllers: [PersonalAccountController],
  providers: [PersonalAccount]
})
export class PersonalAccountModule {
}

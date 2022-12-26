import { Module } from "@nestjs/common";
import { PersonalTwoAuthController } from "./PersonalTwoAuth.controller";
import { PersonalTwoAuthService } from "./PersonalTwoAuth.service";

@Module({
  imports: [],
  controllers: [PersonalTwoAuthController],
  providers: [PersonalTwoAuthService]
})
export class PersonalTwoAuthModule {
}

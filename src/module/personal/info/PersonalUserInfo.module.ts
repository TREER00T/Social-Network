import { Module } from "@nestjs/common";
import { PersonalUserInfoController } from "./PersonalUserInfo.controller";
import { PersonalUserInfoService } from "./PersonalUserInfo.service";

@Module({
  imports: [],
  controllers: [PersonalUserInfoController],
  providers: [PersonalUserInfoService]
})
export class PersonalUserInfoModule {
}

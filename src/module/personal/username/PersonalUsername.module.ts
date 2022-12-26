import { Module } from "@nestjs/common";
import { PersonalUsernameController } from "./PersonalUsername.controller";
import { PersonalUsernameService } from "./PersonalUsername.service";

@Module({
  imports: [],
  controllers: [PersonalUsernameController],
  providers: [PersonalUsernameService]
})
export class PersonalUsernameModule {
}

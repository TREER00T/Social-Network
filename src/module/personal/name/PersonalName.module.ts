import { Module } from "@nestjs/common";
import { PersonalNameController } from "./PersonalName.controller";
import { PersonalNameService } from "./PersonalName.service";

@Module({
  controllers: [PersonalNameController],
  providers: [PersonalNameService]
})
export class PersonalNameModule {
}

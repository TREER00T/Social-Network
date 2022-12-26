import { Module } from "@nestjs/common";
import { PersonalBioController } from "./PersonalBio.controller";
import { PersonalBioService } from "./PersonalBio.service";

@Module({
  imports: [],
  controllers: [PersonalBioController],
  providers: [PersonalBioService]
})
export class PersonalBioModule {
}

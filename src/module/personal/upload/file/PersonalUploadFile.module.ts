import { Module } from "@nestjs/common";
import { PersonalUploadFileController } from "./PersonalUploadFile.controller";
import { PersonalUploadFileService } from "./PersonalUploadFile.service";

@Module({
  imports: [],
  controllers: [PersonalUploadFileController],
  providers: [PersonalUploadFileService]
})
export class PersonalUploadFileModule {
}

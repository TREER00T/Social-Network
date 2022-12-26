import { Module } from "@nestjs/common";
import { GroupUploadFileController } from "./GroupUploadFile.controller";
import { GroupUploadFileService } from "./GroupUploadFile.service";

@Module({
  imports: [],
  controllers: [GroupUploadFileController],
  providers: [GroupUploadFileService]
})
export class GroupUploadFileModule {
}

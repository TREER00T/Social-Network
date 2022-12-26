import { Module } from "@nestjs/common";
import { E2EUploadFileController } from "./E2EUploadFile.controller";
import { E2EUploadFileService } from "./E2EUploadFile.service";

@Module({
  imports: [],
  controllers: [E2EUploadFileController],
  providers: [E2EUploadFileService]
})
export class E2EUploadFileModule {
}

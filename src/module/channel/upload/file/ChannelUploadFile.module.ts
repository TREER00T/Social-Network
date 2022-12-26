import { Module } from "@nestjs/common";
import { ChannelUploadFileController } from "./ChannelUploadFile.controller";
import { ChannelUploadFileService } from "./ChannelUploadFile.service";

@Module({
  imports: [],
  controllers: [ChannelUploadFileController],
  providers: [ChannelUploadFileService]
})
export class ChannelUploadFileModule {
}

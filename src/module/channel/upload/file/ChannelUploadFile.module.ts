import {Module} from "@nestjs/common";
import {ChannelUploadFileController} from "./ChannelUploadFile.controller";

@Module({
    controllers: [ChannelUploadFileController]
})
export class ChannelUploadFileModule {
}

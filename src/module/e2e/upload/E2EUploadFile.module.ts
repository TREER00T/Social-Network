import {Module} from "@nestjs/common";
import {E2EUploadFileController} from "./E2EUploadFile.controller";
import {E2EUploadFileService} from "./E2EUploadFile.service";
import {PersonalUploadFileService} from "../../personal/upload/file/PersonalUploadFile.service";

@Module({
    controllers: [E2EUploadFileController],
    providers: [E2EUploadFileService, PersonalUploadFileService]
})
export class E2EUploadFileModule {
}

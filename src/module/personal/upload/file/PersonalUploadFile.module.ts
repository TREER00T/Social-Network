import {Module} from "@nestjs/common";
import {PersonalUploadFileController} from "./PersonalUploadFile.controller";
import {PersonalUploadFileService} from "./PersonalUploadFile.service";
import {SavedMessageService} from "../../savedMessage/SavedMessage.service";

@Module({
    controllers: [PersonalUploadFileController],
    providers: [PersonalUploadFileService, SavedMessageService]
})
export class PersonalUploadFileModule {
}

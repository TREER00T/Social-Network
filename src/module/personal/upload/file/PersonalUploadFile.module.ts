import {Module} from "@nestjs/common";
import {PersonalUploadFileController} from "./PersonalUploadFile.controller";

@Module({
    controllers: [PersonalUploadFileController]
})
export class PersonalUploadFileModule {
}

import {Module} from "@nestjs/common";
import {GroupUploadFileController} from "./GroupUploadFile.controller";

@Module({
    controllers: [GroupUploadFileController]
})
export class GroupUploadFileModule {
}

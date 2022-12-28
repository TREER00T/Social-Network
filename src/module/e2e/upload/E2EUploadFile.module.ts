import {Module} from "@nestjs/common";
import {E2EUploadFileController} from "./E2EUploadFile.controller";

@Module({
    controllers: [E2EUploadFileController]
})
export class E2EUploadFileModule {
}

import {Controller, Post, Body, UploadedFile, UseInterceptors} from '@nestjs/common';
import {PersonalUploadFileService} from './PersonalUploadFile.service';
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";
import Util from "../../../../util/Util";
import File from "../../../../util/File";
import {SavedMessage} from "../../../base/SavedMessage";

@Controller()
export class PersonalUploadFileController extends SavedMessage {
    constructor(private readonly appService: PersonalUploadFileService) {
        super();
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        await this.init();

        if (Util.isUndefined(file))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let message = Util.validateMessage(msg);

        if (message === Util.IN_VALID_MESSAGE_TYPE || message === Util.IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        this.verifySavedMessage().then(async () => {

            let FileGenerated = await File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: Util.getFileFormat(file.originalname)
            });

            message.fileUrl = FileGenerated.url;
            message.fileSize = FileGenerated.size;
            message.fileName = file.originalname;

            let insertedId = await this.appService.uploadFile(
                `${this.phoneNumber}SavedMessage`, message, 'Personal');

            Json.builder(Response.HTTP_OK, {
                insertedId: insertedId
            });

        });

    }
}

import {Controller, Post, Body, UploadedFile, UseInterceptors} from '@nestjs/common';
import {PersonalUploadFileService} from './PersonalUploadFile.service';
import {UserTokenManager} from "../../../base/UserTokenManager";
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";
import {SavedMessageService} from "../../savedMessage/SavedMessage.service";
import Util from "../../../../util/Util";
import File from "../../../../util/File";

let CommonInsert = require("../../../../model/add/common");

@Controller()
export class PersonalUploadFileController extends UserTokenManager {
    constructor(private readonly appService: PersonalUploadFileService,
                private readonly savedMessageService: SavedMessageService) {
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

        let isUserExist = await this.appService.isUserExist(this.userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let isSavedMessageCreated = await this.savedMessageService.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        let FileGenerated = await File.validationAndWriteFile({
            size: file.size,
            dataBinary: file.buffer,
            format: Util.getFileFormat(file.originalname)
        });

        message.fileUrl = FileGenerated.url;
        message.fileSize = FileGenerated.size;
        message.fileName = file.originalname;

        let insertedId = await CommonInsert.message(`${this.phoneNumber}SavedMessage`, message, {
            conversationType: 'Personal'
        });

        Json.builder(Response.HTTP_OK, {
            insertedId: insertedId
        });

    }
}

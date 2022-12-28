import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {E2EUploadFileService} from './E2EUploadFile.service';
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import File from "../../../util/File";
import {UserTokenManager} from "../../base/UserTokenManager";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../base/dto/Message";
import {PersonalUploadFileService} from "../../personal/upload/file/PersonalUploadFile.service";

@Controller()
export class E2EUploadFileController extends UserTokenManager {
    constructor(private readonly appService: E2EUploadFileService,
                private readonly personalUploadFileService: PersonalUploadFileService) {
        super();
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        await this.init();

        let targetUserId = msg?.receiverId;

        let isTargetUserExist = await this.personalUploadFileService.isUserExist(targetUserId);

        if (!isTargetUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        delete msg?.receiverId;

        if (Util.isUndefined(file))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let message = Util.validateMessage(msg);

        if (message === Util.IN_VALID_MESSAGE_TYPE || message === Util.IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        let isUserExist = await this.personalUploadFileService.isUserExist(this.userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let isExistChatRoom = await this.appService.isExistChatRoom({
            toUser: targetUserId,
            fromUser: this.userId
        });

        if (!isExistChatRoom)
            return Json.builder(Response.HTTP_NOT_FOUND);

        if (Util.isUndefined(targetUserId) || Util.isUndefined(targetUserId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let FileGenerated = await File.validationAndWriteFile({
            size: file.size,
            dataBinary: file.buffer,
            format: Util.getFileFormat(file.originalname)
        });

        message.fileUrl = FileGenerated.url;
        message.fileSize = FileGenerated.size;
        message.fileName = file.originalname;

        let insertedId = await this.personalUploadFileService.uploadFile(
            `${this.userId}And${targetUserId}E2EContents`, message, 'E2E');

        Json.builder(Response.HTTP_OK, {
            insertedId: insertedId
        });
    }
}

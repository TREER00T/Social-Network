import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import File from "../../../util/File";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../base/dto/Message";
import {E2EMessage} from "../../base/E2EMessage";

@Controller()
export class E2EUploadFileController extends E2EMessage {
    constructor() {
        super();
        this.init();
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        if (Util.isUndefined(file))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let targetUserId = msg?.receiverId;

        if (Util.isUndefined(msg?.senderId))
            return Json.builder(Response.HTTP_BAD_REQUEST);


        this.verifyUser(targetUserId).then(async () => {

            let isExistChatRoom = await this.isExistChatRoom({
                toUser: targetUserId,
                fromUser: this.userId
            });

            if (!isExistChatRoom)
                return Json.builder(Response.HTTP_NOT_FOUND);

            delete msg?.receiverId;

            let message = Util.validateMessage(msg);

            if (message === Util.IN_VALID_MESSAGE_TYPE || message === Util.IN_VALID_OBJECT_KEY)
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);


            let FileGenerated = await File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: Util.getFileFormat(file.originalname)
            });

            message.fileUrl = FileGenerated.url;
            message.fileSize = FileGenerated.size;
            message.fileName = file.originalname;

            let insertedId = await this.uploadFile(
                `${this.userId}And${targetUserId}E2EContents`, message, 'E2E');

            return Json.builder(Response.HTTP_CREATED, {
                insertedId: insertedId
            });

        });
    }
}

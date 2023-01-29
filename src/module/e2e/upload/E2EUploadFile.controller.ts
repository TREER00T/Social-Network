import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {FileInterceptor} from "@nestjs/platform-express";
import {RoomMessage} from "../../base/dto/RoomMessage";
import {E2EMessage} from "../../base/E2EMessage";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class E2EUploadFileController extends E2EMessage {

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: RoomMessage) {
        await this.init();

        let targetUserId = msg?.receiverId;

        let message = await PromiseVerify.all([
            this.isUndefined(file),
            this.isUndefined(msg?.senderId),
            this.verifyUser(targetUserId),
            this.handleMessage(msg)
        ]);

        if (message?.statusCode)
            return message;

        let isExistChatRoom = await this.isExistChatRoom({
            toUser: targetUserId,
            fromUser: this.userId
        });

        if (!isExistChatRoom)
            return Json.builder(Response.HTTP_NOT_FOUND);

        delete message?.receiverId;

        return await this.saveAndGetId({
            file: {
                size: file.size,
                buffer: file.buffer,
                name: file.originalname
            },
            tableName: `${this.userId}And${targetUserId}E2EContents`,
            message: message,
            conversationType: "E2E"
        });
    }
}

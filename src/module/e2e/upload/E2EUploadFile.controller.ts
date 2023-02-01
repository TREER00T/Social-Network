import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {FileInterceptor} from "@nestjs/platform-express";
import PromiseVerify from "../../base/PromiseVerify";
import {E2EMessage} from "../../base/E2EMessage";
import {TE2EMessage} from "../../base/dto/TE2EMessage";

@Controller()
export class E2EUploadFileController extends E2EMessage {

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: TE2EMessage) {
        await this.init();

        let targetUserId = msg?.receiverId;

        let message = await PromiseVerify.all([
            this.isUndefined(file),
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

        delete message.receiverId;

        return await this.saveAndGetId({
            file: {
                size: file.size,
                buffer: file.buffer,
                name: file.originalname
            },
            tableName: msg.roomId,
            message: message,
            conversationType: "E2E"
        });
    }
}

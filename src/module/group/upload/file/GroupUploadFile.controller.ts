import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {RoomMessage} from "../../../base/dto/RoomMessage";
import PromiseVerify from "../../../base/PromiseVerify";
import {Group} from "../../../base/Group";

@Controller()
export class GroupUploadFileController extends Group {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: RoomMessage) {
        await this.init();

        let groupId = msg.roomId;

        let message = await PromiseVerify.all([
            this.isUndefined(file),
            this.isUserJoined(groupId),
            this.handleMessage(msg)
        ]);

        // In this case will be error
        if (message?.statusCode)
            return message;

        delete message.roomId;

        message.messageCreatedBySenderId = this.userId;
        message.messageSentRoomId = `${groupId}GroupContents`;

        return await this.saveAndGetId({
            file: {
                size: file.size,
                buffer: file.buffer,
                name: file.originalname
            },
            tableName: message.messageSentRoomId,
            message: message
        });
    }
}

import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {Channel} from "../../../base/Channel";
import {FileInterceptor} from "@nestjs/platform-express";
import {RoomMessage} from "../../../base/dto/RoomMessage";
import PromiseVerify from "../../../base/PromiseVerify";

@Controller()
export class ChannelUploadFileController extends Channel {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: RoomMessage) {
        await this.init();

        let channelId = msg.roomId;

        let message = await PromiseVerify.all([
            this.isUndefined(file),
            this.isUserJoined(channelId),
            this.isOwnerOrAdmin(channelId),
            this.handleMessage(msg)
        ]);

        // In this case will be error
        if (message?.statusCode)
            return message;

        delete message.roomId;

        message.messageSentRoomId = `${channelId}ChannelContents`;
        message.messageCreatedBySenderId = this.userId;

        return await this.saveAndGetId({
            file: {
                size: file.size,
                buffer: file.buffer,
                name: file.originalname
            },
            tableName: `${channelId}ChannelContents`,
            message: message,
            conversationType: "Channel"
        });
    }
}

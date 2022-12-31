import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {Channel} from "../../../base/Channel";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";
import Util from "../../../../util/Util";
import PromiseVerify from "../../../base/PromiseVerify";

@Controller()
export class ChannelUploadFileController extends Channel {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        this.init();

        let receiverId = msg?.receiverId,
            channelId = msg?.channelId;

        if (!Util.isUndefined(receiverId))
            delete msg?.receiverId;

        let message = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isUndefined(file),
            this.isUserJoined(channelId),
            this.isOwnerOrAdmin(channelId),
            this.handleMessage(msg)
        ]);

        // In this case will be error
        if (message?.code)
            return message;

        delete message?.channelId;

        message.senderId = this.userId;

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

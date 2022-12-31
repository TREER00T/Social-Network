import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";
import Util from "../../../../util/Util";
import PromiseVerify from "../../../base/PromiseVerify";
import {Group} from "../../../base/Group";

@Controller()
export class GroupUploadFileController extends Group {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        this.init();

        let receiverId = msg?.receiverId,
            groupId = msg?.groupId;

        if (!Util.isUndefined(receiverId))
            delete msg?.receiverId;

        let message = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isUndefined(file),
            this.isUserJoined(groupId),
            this.handleMessage(msg)
        ]);

        // In this case will be error
        if (message?.code)
            return message;

        delete message?.groupId;

        message.senderId = this.userId;

        return await this.saveAndGetId({
            file: {
                size: file.size,
                buffer: file.buffer,
                name: file.originalname
            },
            tableName: `${groupId}GroupContents`,
            message: message,
            conversationType: "Group"
        });
    }
}

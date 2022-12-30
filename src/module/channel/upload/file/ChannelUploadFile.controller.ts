import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ChannelUploadFileService} from './ChannelUploadFile.service';
import {Channel} from "../../../base/Channel";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";
import Util from "../../../../util/Util";
import Response from "../../../../util/Response";
import Json from "../../../../util/ReturnJson";
import File from "../../../../util/File";

@Controller()
export class ChannelUploadFileController extends Channel {
    constructor(private readonly appService: ChannelUploadFileService) {
        super();
        this.init();
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        let receiverId = msg?.receiverId,
            channelId = msg?.channelId;

        if (!Util.isUndefined(receiverId))
            delete msg?.receiverId;

        this.isUndefined(channelId)
            .then(() => this.isUndefined(file))
            .then(() => this.isUserJoined(channelId))
            .then(() => this.isOwnerOrAdmin(channelId))
            .then(() => this.handleMessage(msg))
            .then(async message => {

                delete message?.channelId;

                message.senderId = this.userId;

                let FileGenerated = await File.validationAndWriteFile({
                    size: file.size,
                    dataBinary: file.buffer,
                    format: Util.getFileFormat(file.originalname)
                });

                message.fileUrl = FileGenerated.url;
                message.fileSize = FileGenerated.size;
                message.fileName = file.originalname;

                return message;
            })
            .then(async message =>
                this.appService.uploadFileWithMessage(
                    `${channelId}ChannelContents`, await message, "Channel"))
            .then(async insertedId => {
                Json.builder(Response.HTTP_CREATED, {
                    insertId: insertedId
                });
            });
    }
}

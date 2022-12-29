import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ChannelUploadFileService} from './ChannelUploadFile.service';
import {Channel} from "../../../base/Channel";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";

@Controller()
export class ChannelUploadFileController extends Channel {
    constructor(private readonly appService: ChannelUploadFileService) {
        super();
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        await this.init();


    }
}

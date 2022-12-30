import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreateChannelService} from './CreateChannel.service';
import {FileInterceptor} from "@nestjs/platform-express";
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import {User} from "../../base/User";
import File from "../../../util/File";

@Controller()
export class CreateChannelController extends User {
    constructor(private readonly appService: CreateChannelService) {
        super();
        this.init();
    }

    @Post()
    @UseInterceptors(FileInterceptor("avatar"))
    async createChannel(@UploadedFile() avatar: Express.Multer.File, @Body("name") name: string) {
        let avatarUrl;

        if (Util.isUndefined(name))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        if (!Util.isUndefined(avatar))
            avatarUrl = await File.validationAndWriteFile({
                size: avatar.size,
                dataBinary: avatar.buffer,
                format: Util.getFileFormat(avatar.originalname)
            });

        let channelId = await this.appService.createChannelAndReturnId(name, avatarUrl);

        await this.appService.createChannelContent(this.userId, channelId);

        return Json.builder(Response.HTTP_CREATED);
    }
}

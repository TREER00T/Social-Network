import {Body, Controller, Delete, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ChannelService} from './Channel.service';
import {FileInterceptor} from "@nestjs/platform-express";
import Util from "../../util/Util";
import Response from "../../util/Response";
import Json from "../../util/ReturnJson";
import File from "../../util/File";
import PromiseVerify from "../base/PromiseVerify";
import {Channel} from "../base/Channel";

@Controller()
export class ChannelController extends Channel {
    constructor(private readonly appService: ChannelService) {
        super();
    }

    @Post()
    @UseInterceptors(FileInterceptor("avatar"))
    async createChannel(@UploadedFile() avatar: Express.Multer.File, @Body("name") name: string) {
        await this.init();

        let avatarUrl;

        if (Util.isUndefined(name))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        if (!Util.isUndefined(avatar))
            avatarUrl = await File.validationAndWriteFile({
                size: avatar.size,
                dataBinary: avatar.buffer,
                format: Util.getFileFormat(avatar.originalname)
            });

        let channelId = await this.appService.createChannelAndReturnId(name, avatarUrl?.url);

        await this.appService.createChannelContent(this.userId, channelId);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Delete()
    async removeChannel(@Body("channelId") channelId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.removeChannel(channelId);
        await this.deleteOldFileWhenAdminWantToDeleteRoom('channel', channelId);

        return Json.builder(Response.HTTP_OK);
    }
}

import {Body, Controller, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ChannelUploadAvatarService} from './ChannelUploadAvatar.service';
import {FileInterceptor} from "@nestjs/platform-express";
import Util from "../../../../util/Util";
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import File from "../../../../util/File";
import {Channel} from "../../../base/Channel";
import PromiseVerify from "../../../base/PromiseVerify";

@Controller()
export class ChannelUploadAvatarController extends Channel {
    constructor(private readonly appService: ChannelUploadAvatarService) {
        super();
    }

    @Put()
    @UseInterceptors(FileInterceptor("avatar"))
    async save(@UploadedFile() avatar: Express.Multer.File, @Body("channelId") channelId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(avatar),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        let FileGenerated = await File.validationAndWriteFile({
            size: avatar.size,
            dataBinary: avatar.buffer,
            format: Util.getFileFormat(avatar.originalname)
        });

        await this.appService.updateAvatar(channelId, FileGenerated.url);

        return Json.builder(Response.HTTP_CREATED);
    }
}

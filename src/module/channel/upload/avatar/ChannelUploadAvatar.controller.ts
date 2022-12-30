import {Body, Controller, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ChannelUploadAvatarService} from './ChannelUploadAvatar.service';
import {FileInterceptor} from "@nestjs/platform-express";
import Util from "../../../../util/Util";
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import File from "../../../../util/File";
import {Channel} from "../../../base/Channel";

@Controller()
export class ChannelUploadAvatarController extends Channel {
    constructor(private readonly appService: ChannelUploadAvatarService) {
        super();
        this.init();
    }

    @Put()
    @UseInterceptors(FileInterceptor("avatar"))
    async save(@UploadedFile() avatar: Express.Multer.File, @Body("channelId") channelId: string) {

        this.isUndefined(avatar)
            .then(() => this.isOwner(channelId))
            .then(() => File.validationAndWriteFile({
                size: avatar.size,
                dataBinary: avatar.buffer,
                format: Util.getFileFormat(avatar.originalname)
            }))
            .then(async FileGenerated => {

                await this.appService.updateAvatar(channelId, FileGenerated.url);

                Json.builder(Response.HTTP_CREATED);

            });


    }
}

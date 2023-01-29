import {Body, Controller, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {GroupUploadAvatarService} from './GroupUploadAvatar.service';
import {FileInterceptor} from "@nestjs/platform-express";
import Util from "../../../../util/Util";
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import File from "../../../../util/File";
import PromiseVerify from "../../../base/PromiseVerify";
import {Group} from "../../../base/Group";

@Controller()
export class GroupUploadAvatarController extends Group {
    constructor(private readonly appService: GroupUploadAvatarService) {
        super();
    }

    @Put()
    @UseInterceptors(FileInterceptor("avatar"))
    async save(@UploadedFile() avatar: Express.Multer.File, @Body("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(avatar),
            this.isOwner(groupId)
        ]);

        if (haveErr)
            return haveErr;

        let FileGenerated = await File.validationAndWriteFile({
            size: avatar.size,
            dataBinary: avatar.buffer,
            format: Util.getFileFormat(avatar.originalname)
        });

        await this.appService.updateAvatar(groupId, FileGenerated.url);

        return Json.builder(Response.HTTP_CREATED);
    }
}

import {Controller, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {PersonalUploadAvatarService} from './PersonalUploadAvatar.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {UserTokenManager} from "../../../base/UserTokenManager";
import Util from "../../../../util/Util";
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import File from "../../../../util/File";

@Controller()
export class PersonalUploadAvatarController extends UserTokenManager {
    constructor(private readonly appService: PersonalUploadAvatarService) {
        super();
    }

    @Put()
    @UseInterceptors(FileInterceptor("avatar"))
    async save(@UploadedFile() avatar: Express.Multer.File) {
        await this.init();

        if (Util.isUndefined(avatar))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let FileGenerated = await File.validationAndWriteFile({
            size: avatar.size,
            dataBinary: avatar.buffer,
            format: Util.getFileFormat(avatar.originalname)
        });

        await this.appService.updateAvatar(this.phoneNumber, FileGenerated.url);

        return Json.builder(Response.HTTP_OK);
    }
}

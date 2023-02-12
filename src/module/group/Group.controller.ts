import {Body, Controller, Delete, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {GroupService} from './Group.service';
import {FileInterceptor} from "@nestjs/platform-express";
import Util from "../../util/Util";
import Response from "../../util/Response";
import Json from "../../util/ReturnJson";
import File from "../../util/File";
import PromiseVerify from "../base/PromiseVerify";
import {Group} from "../base/Group";

@Controller()
export class GroupController extends Group {
    constructor(private readonly appService: GroupService) {
        super();
    }

    @Post()
    @UseInterceptors(FileInterceptor("avatar"))
    async createGroup(@UploadedFile() avatar: Express.Multer.File, @Body("name") name: string) {
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

        let groupId = await this.appService.createGroupAndReturnId(name, avatarUrl?.url);

        await this.appService.createGroupContent(this.userId, groupId);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Delete()
    async removeGroup(@Body("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isOwner(groupId)
        ]);

        if (haveErr)
            return haveErr;

        await this.deleteOldFileWhenAdminWantToDeleteRoom('group', groupId);
        await this.appService.removeGroup(groupId);

        return Json.builder(Response.HTTP_OK);
    }
}

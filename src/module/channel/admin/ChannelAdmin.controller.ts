import {Body, Controller, Delete, Post} from '@nestjs/common';
import {ChannelAdminService} from './ChannelAdmin.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import Util from "../../../util/Util";

@Controller()
export class ChannelAdminController extends Channel {
    constructor(private readonly appService: ChannelAdminService) {
        super();
        this.init();
    }

    @Post("/add")
    async addAdmin(@Body("channelId") channelId: string, @Body("targetUserId") targetUserId: string) {
        if (Util.isUndefined(channelId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        this.isChannelExist(channelId)
            .then(() => this.verifyUser(targetUserId))
            .then(() => this.verifyUser(this.userId))
            .then(() => this.isOwner(channelId))
            .then(() => this.isUserJoined(channelId))
            .then(() => this.isUserJoined(channelId, targetUserId))
            .then(async () => {

                let isAdmin = this.isAdmin(channelId, targetUserId);

                if (!isAdmin)
                    return Json.builder(Response.HTTP_CONFLICT);

                await this.appService.addAdmin(channelId, targetUserId);

                Json.builder(Response.HTTP_OK);

            });

    }

    @Delete("/remove")
    async removeAdmin(@Body("channelId") channelId: string, @Body("targetUserId") targetUserId: string) {
        if (Util.isUndefined(channelId) || Util.isUndefined(targetUserId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        this.isChannelExist(channelId)
            .then(() => this.verifyUser(targetUserId))
            .then(() => this.verifyUser(this.userId))
            .then(() => this.isOwner(channelId))
            .then(() => this.isUserJoined(channelId))
            .then(() => this.isUserJoined(channelId, targetUserId))
            .then(async () => {

                let isAdmin = this.isAdmin(channelId, targetUserId);

                if (isAdmin)
                    return Json.builder(Response.HTTP_CONFLICT);

                await this.appService.removeAdmin(channelId, targetUserId);

                Json.builder(Response.HTTP_CREATED);

            });
    }
}

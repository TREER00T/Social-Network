import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {ChannelUserService} from './ChannelUser.service';
import {Channel} from "../../base/Channel";
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class ChannelUserController extends Channel {
    constructor(private readonly appService: ChannelUserService) {
        super();
        this.init();
    }

    @Get("/all")
    async listOfUsers(@Body("channelId") channelId: string) {
        this.isUndefined(channelId)
            .then(() => this.isOwnerOrAdmin(channelId))
            .then(async () => {

                Json.builder(Response.HTTP_OK,
                    this.appService.listOfUserWithDetails(
                        await this.appService.listOfUser(channelId)));

            });
    }

    @Delete("/leave")
    async leaveUser(@Body("channelId") channelId: string) {

        this.isUndefined(channelId)
            .then(async () => {

                let isJoinedUser = await this.isNotJoinedUser(channelId);

                if (!isJoinedUser)
                    return Json.builder(Response.HTTP_CONFLICT);

                await this.appService.leaveUser(channelId, this.userId);

                Json.builder(Response.HTTP_OK);

            });

    }

    @Post("/join")
    async joinUser(@Body("channelId") channelId: string) {

        this.isUndefined(channelId)
            .then(async () => {
                let isJoinedUser = await this.isNotJoinedUser(channelId);

                if (isJoinedUser)
                    return Json.builder(Response.HTTP_CONFLICT);

                await this.appService.joinUser(channelId, this.userId);

                return Json.builder(Response.HTTP_CREATED);

            });

    }
}

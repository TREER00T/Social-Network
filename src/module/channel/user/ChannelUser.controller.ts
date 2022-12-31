import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {ChannelUserService} from './ChannelUser.service';
import {Channel} from "../../base/Channel";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class ChannelUserController extends Channel {
    constructor(private readonly appService: ChannelUserService) {
        super();
    }

    @Get("/all")
    async listOfUsers(@Body("channelId") channelId: string) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isOwnerOrAdmin(channelId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK,
            await this.appService.listOfUserWithDetails(
                await this.appService.listOfUser(channelId)));
    }

    @Delete("/leave")
    async leaveUser(@Body("channelId") channelId: string) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId)
        ]);

        if (haveErr)
            return haveErr;

        let isJoinedUser = await this.isNotJoinedUser(channelId);

        if (!isJoinedUser)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.leaveUser(channelId, this.userId);

        return Json.builder(Response.HTTP_OK);
    }

    @Post("/join")
    async joinUser(@Body("channelId") channelId: string) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId)
        ]);

        if (haveErr)
            return haveErr;

        let isJoinedUser = await this.isNotJoinedUser(channelId);

        if (isJoinedUser)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.joinUser(channelId, this.userId);

        return Json.builder(Response.HTTP_CREATED);

    }
}

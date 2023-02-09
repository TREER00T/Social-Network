import {Body, Controller, Get, Put, Query} from '@nestjs/common';
import {ChannelLinkService} from './ChannelLink.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import Generate from "../../../util/Generate";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class ChannelLinkController extends Channel {
    constructor(private readonly appService: ChannelLinkService) {
        super();
    }

    @Get()
    async getInviteAndPublicLink(@Query("channelId") channelId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK,
            this.appService.getInviteAndPublicLink(channelId));
    }

    @Put("/invite")
    async invite(@Body("channelId") channelId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        let link = Generate.makeIdForInviteLink();

        await this.appService.updateInviteLink(channelId, link);

        return Json.builder(Response.HTTP_CREATED, {
            inviteLink: link
        });
    }

    @Put("/public")
    async public(@Body("channelId") channelId: string, @Body("link") publicLink: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        let link = Generate.makeIdForPublicLink(publicLink);

        let hsExistPublicLink = await this.appService.hasExistPublicLink(link);

        if (hsExistPublicLink)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.updatePublicLink(channelId, link);

        return Json.builder(Response.HTTP_CREATED, {
            publicLink: link
        });
    }
}

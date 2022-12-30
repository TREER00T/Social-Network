import {Body, Controller, Put} from '@nestjs/common';
import {ChannelLinkService} from './ChannelLink.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import Generate from "../../../util/Generate";

@Controller()
export class ChannelLinkController extends Channel {
    constructor(private readonly appService: ChannelLinkService) {
        super();
        this.init();
    }

    @Put("/invite")
    async invite(@Body("channelId") channelId: string) {
        this.isUndefined(channelId)
            .then(() => this.isOwner(channelId))
            .then(async () => {

                let link = Generate.makeIdForInviteLink();

                await this.appService.updateInviteLink(channelId, link);

                Json.builder(Response.HTTP_OK, {
                    inviteLink: link
                });

            });
    }

    @Put("/public")
    async public(@Body("channelId") channelId: string, @Body("publicLink") publicLink: string) {
        let link = Generate.makeIdForPublicLink(publicLink);

        this.isUndefined(channelId)
            .then(() => this.isOwner(channelId))
            .then(async () => {
                let hsExistPublicLink = await this.appService.hasExistPublicLink(link);

                if (hsExistPublicLink)
                    return Json.builder(Response.HTTP_CONFLICT);
            })
            .then(async () => {

                await this.appService.updatePublicLink(channelId, link);

                Json.builder(Response.HTTP_CREATED, {
                    inviteLink: link
                });

            });
    }
}

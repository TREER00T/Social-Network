import {Body, Controller, Put} from '@nestjs/common';
import {GroupLinkService} from './GroupLink.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import Generate from "../../../util/Generate";
import PromiseVerify from "../../base/PromiseVerify";
import {Group} from "../../base/Group";

@Controller()
export class GroupLinkController extends Group {
    constructor(private readonly appService: GroupLinkService) {
        super();
    }

    @Put("/invite")
    async invite(@Body("groupId") groupId: string) {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isOwner(groupId)
        ]);

        if (haveErr)
            return haveErr;

        let link = Generate.makeIdForInviteLink();

        await this.appService.updateInviteLink(groupId, link);

        return Json.builder(Response.HTTP_OK, {
            inviteLink: link
        });
    }

    @Put("/public")
    async public(@Body("groupId") groupId: string, @Body("publicLink") publicLink: string) {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isOwner(groupId)
        ]);

        if (haveErr)
            return haveErr;

        let link = Generate.makeIdForPublicLink(publicLink);

        let hsExistPublicLink = await this.appService.hasExistPublicLink(link);

        if (hsExistPublicLink)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.updatePublicLink(groupId, link);

        return Json.builder(Response.HTTP_CREATED, {
            inviteLink: link
        });
    }
}

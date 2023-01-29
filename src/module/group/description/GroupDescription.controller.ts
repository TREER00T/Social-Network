import {Body, Controller, Put} from '@nestjs/common';
import {GroupDescriptionService} from './GroupDescription.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";
import {Group} from "../../base/Group";

@Controller()
export class GroupDescriptionController extends Group {
    constructor(private readonly appService: GroupDescriptionService) {
        super();
    }

    @Put()
    async update(@Body("groupId") groupId: string, @Body("description") description: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isUndefined(description),
            this.isOwner(groupId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.updateDescription(description, groupId);

        return Json.builder(Response.HTTP_OK);
    }
}

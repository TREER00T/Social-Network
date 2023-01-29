import {Body, Controller, Put} from '@nestjs/common';
import {GroupNameService} from './GroupName.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import PromiseVerify from "../../base/PromiseVerify";
import {Group} from "../../base/Group";

@Controller()
export class GroupNameController extends Group {
    constructor(private readonly appService: GroupNameService) {
        super();
    }

    @Put()
    async update(@Body("groupId") groupId: string, @Body("name") name: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isUndefined(name),
            this.isOwner(groupId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.updateName(name, groupId);

        return Json.builder(Response.HTTP_OK);
    }
}

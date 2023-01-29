import {Body, Controller, Delete} from '@nestjs/common';
import {DeleteGroupService} from './DeleteGroup.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import PromiseVerify from "../../base/PromiseVerify";
import {Group} from "../../base/Group";


@Controller()
export class DeleteGroupController extends Group {

    constructor(private readonly appService: DeleteGroupService) {
        super();
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

        await this.appService.removeGroup(groupId);

        return Json.builder(Response.HTTP_OK);
    }

}

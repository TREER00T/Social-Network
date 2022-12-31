import {Controller, Delete, Param} from '@nestjs/common';
import {DeleteChannelService} from './DeleteChannel.service';
import {Channel} from "../../base/Channel";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import PromiseVerify from "../../base/PromiseVerify";


@Controller()
export class DeleteChannelController extends Channel {

    constructor(private readonly appService: DeleteChannelService) {
        super();
    }

    @Delete()
    async removeChannel(@Param("channelId") channelId: string) {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.removeChannel(channelId);

        return Json.builder(Response.HTTP_OK);
    }

}

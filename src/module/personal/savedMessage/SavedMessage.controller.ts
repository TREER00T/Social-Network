import {Controller, Delete, Post} from '@nestjs/common';
import {SavedMessageService} from './SavedMessage.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {SavedMessage} from "../../base/SavedMessage";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class SavedMessageController extends SavedMessage {
    constructor(private readonly appService: SavedMessageService) {
        super();
    }

    @Post()
    async createSavedMessage() {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.addSavedMessage(this.phoneNumber);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Delete()
    async deleteSavedMessage() {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.removeSavedMessage(this.phoneNumber);

        return Json.builder(Response.HTTP_OK);
    }
}

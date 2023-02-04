import {Controller, Delete, Get, Post} from '@nestjs/common';
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

    @Get("exist")
    async hasExist() {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK);
    }

    @Post()
    async createSavedMessage() {
        await this.init();

        await this.appService.addSavedMessage(this.userId);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Delete()
    async deleteSavedMessage() {
        await this.init();

        await this.appService.removeSavedMessage(this.userId);

        return Json.builder(Response.HTTP_OK);
    }
}

import {Controller, Delete, Get, Post} from '@nestjs/common';
import {SavedMessageService} from './SavedMessage.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class SavedMessageController extends UserTokenManager {
    constructor(private readonly appService: SavedMessageService) {
        super();
    }

    @Post()
    async createSavedMessage() {
        await this.init();

        let isSavedMessageCreated = await this.appService.isSavedMessageCreated(this.phoneNumber);

        if (isSavedMessageCreated)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.addSavedMessage(this.phoneNumber);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Delete()
    async deleteSavedMessage() {
        await this.init();

        let isSavedMessageCreated = await this.appService.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await this.appService.removeSavedMessage(this.phoneNumber);

        return Json.builder(Response.HTTP_OK);
    }
}

import {Controller, Delete, Post} from '@nestjs/common';
import {SavedMessageService} from './SavedMessage.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {SavedMessage} from "../../base/SavedMessage";

@Controller()
export class SavedMessageController extends SavedMessage {
    constructor(private readonly appService: SavedMessageService) {
        super();
    }

    @Post()
    async createSavedMessage() {
        await this.init();

        this.verifySavedMessage().then(async () => {

            await this.appService.addSavedMessage(this.phoneNumber);

            return Json.builder(Response.HTTP_CREATED);

        });
    }

    @Delete()
    async deleteSavedMessage() {
        await this.init();

        this.verifySavedMessage().then(async () => {

            await this.appService.removeSavedMessage(this.phoneNumber);

            return Json.builder(Response.HTTP_OK);

        });
    }
}

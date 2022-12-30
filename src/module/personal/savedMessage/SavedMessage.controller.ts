import {Controller, Delete, Post} from '@nestjs/common';
import {SavedMessageService} from './SavedMessage.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {SavedMessage} from "../../base/SavedMessage";

@Controller()
export class SavedMessageController extends SavedMessage {
    constructor(private readonly appService: SavedMessageService) {
        super();
        this.init();
    }

    @Post()
    async createSavedMessage() {
        this.verifySavedMessage().then(async () => {

            await this.appService.addSavedMessage(this.phoneNumber);

            return Json.builder(Response.HTTP_CREATED);

        });
    }

    @Delete()
    async deleteSavedMessage() {
        this.verifySavedMessage().then(async () => {

            await this.appService.removeSavedMessage(this.phoneNumber);

            return Json.builder(Response.HTTP_OK);

        });
    }
}

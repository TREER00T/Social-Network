import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {Message} from "./dto/Message";
import {User} from "./User";

let Find = require("../../model/find/user");

export abstract class SavedMessage extends User {
    async verifySavedMessage() {
        let isSavedMessageCreated = await Find.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async handleSavedMessage(msg: Message) {
        return this.verifySavedMessage().then(() => this.handleMessage(msg))
    }

}
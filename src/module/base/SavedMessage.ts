import {HandleMessage} from "./HandleMessage";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";

let Find = require("../../model/find/user");

export abstract class SavedMessage extends HandleMessage {
    async verifySavedMessage() {
        let isSavedMessageCreated = await  Find.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

}
import {User} from "./User";
import Json from "../../util/ReturnJson";
import Find from "../../model/find/user";
import Response from "../../util/Response";
import PromiseVerify from "./PromiseVerify";
import {PersonalMessage} from "./dto/PersonalMessage";

export abstract class SavedMessage extends User {
    async verifySavedMessage() {
        let isSavedMessageCreated = await Find.isSavedMessageCreated(this.userId);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async handleSavedMessage(msg: PersonalMessage) {
        return await PromiseVerify.all([
            this.verifySavedMessage(),
            this.handleMessage(msg)
        ]);
    }
}
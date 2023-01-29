import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {RoomMessage} from "./dto/RoomMessage";
import {User} from "./User";
import PromiseVerify from "./PromiseVerify";
import Find from "../../model/find/user";
import {PersonalMessage} from "./dto/PersonalMessage";

export abstract class SavedMessage extends User {
    async verifySavedMessage() {
        let isSavedMessageCreated = await Find.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async handleSavedMessage(msg: RoomMessage | PersonalMessage) {
        return await PromiseVerify.all([
            this.verifySavedMessage(),
            this.handleMessage(msg)
        ]);
    }
}
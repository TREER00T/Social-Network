import {Module} from "@nestjs/common";
import {PersonalMessageController} from "./PersonalMessage.controller";
import {PersonalAccount} from "./PersonalMessage.service";
import {SavedMessageService} from "../savedMessage/SavedMessage.service";

@Module({
    controllers: [PersonalMessageController],
    providers: [PersonalAccount, SavedMessageService]
})
export class PersonalMessageModule {
}

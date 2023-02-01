import {Module} from "@nestjs/common";
import {PersonalMessageController} from "./PersonalMessage.controller";
import {PersonalMessageService} from "./PersonalMessage.service";

@Module({
    controllers: [PersonalMessageController],
    providers: [PersonalMessageService]
})
export class PersonalMessageModule {
}

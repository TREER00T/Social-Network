import {Module} from "@nestjs/common";
import {E2EChatsController} from "./E2EChats.controller";
import {E2EChatsService} from "./E2EChats.service";
import {PersonalAccount} from "../../personal/message/PersonalMessage.service";

@Module({
    controllers: [E2EChatsController],
    providers: [E2EChatsService, PersonalAccount]
})
export class E2EChatsModule {
}

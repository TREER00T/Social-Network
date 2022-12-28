import {Module} from "@nestjs/common";
import {E2EChatsController} from "./E2EChats.controller";

@Module({
    controllers: [E2EChatsController]
})
export class E2EChatsModule {
}

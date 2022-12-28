import {Module} from "@nestjs/common";
import {GroupChatsController} from "./GroupChats.controller";
import {GroupChatsService} from "./GroupChats.service";

@Module({
    controllers: [GroupChatsController],
    providers: [GroupChatsService]
})
export class GroupChatsModule {
}

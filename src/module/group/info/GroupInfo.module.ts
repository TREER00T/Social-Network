import {Module} from "@nestjs/common";
import {GroupInfoController} from "./GroupInfo.controller";
import {GroupInfoService} from "./GroupInfo.service";

@Module({
    controllers: [GroupInfoController],
    providers: [GroupInfoService]
})
export class GroupInfoModule {
}

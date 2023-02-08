import {Module} from "@nestjs/common";
import {GroupController} from "./Group.controller";
import {GroupService} from "./Group.service";

@Module({
    controllers: [GroupController],
    providers: [GroupService]
})
export class GroupModule {
}

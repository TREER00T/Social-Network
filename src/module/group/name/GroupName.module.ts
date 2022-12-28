import {Module} from "@nestjs/common";
import {GroupNameController} from "./GroupName.controller";
import {GroupNameService} from "./GroupName.service";

@Module({
    controllers: [GroupNameController],
    providers: [GroupNameService]
})
export class GroupNameModule {
}

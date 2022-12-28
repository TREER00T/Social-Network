import {Module} from "@nestjs/common";
import {CreateGroupController} from "./CreateGroup.controller";
import {CreateGroupService} from "./CreateGroup.service";

@Module({
    controllers: [CreateGroupController],
    providers: [CreateGroupService]
})
export class CreateGroupModule {
}

import {Module} from "@nestjs/common";
import {DeleteGroupController} from "./DeleteGroup.controller";
import {DeleteGroupService} from "./DeleteGroup.service";

@Module({
    controllers: [DeleteGroupController],
    providers: [DeleteGroupService]
})
export class DeleteGroupModule {
}

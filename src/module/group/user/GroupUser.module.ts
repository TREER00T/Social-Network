import {Module} from "@nestjs/common";
import {GroupUserController} from "./GroupUser.controller";
import {GroupUserService} from "./GroupUser.service";

@Module({
    controllers: [GroupUserController],
    providers: [GroupUserService]
})
export class GroupUserModule {
}

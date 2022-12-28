import {Module} from "@nestjs/common";
import {GroupUserController} from "./GroupUser.controller";
import {GroupUsersService} from "./GroupUsers.service";

@Module({
    controllers: [GroupUserController],
    providers: [GroupUsersService]
})
export class GroupUserModule {
}

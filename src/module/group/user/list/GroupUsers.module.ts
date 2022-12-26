import { Module } from "@nestjs/common";
import { GroupUsersController } from "./GroupUsers.controller";
import { GroupUsersService } from "./GroupUsers.service";

@Module({
  imports: [],
  controllers: [GroupUsersController],
  providers: [GroupUsersService]
})
export class GroupUsersModule {
}

import { Module } from "@nestjs/common";
import { GroupUserLeaveController } from "./GroupUserLeave.controller";
import { GroupUserLeaveService } from "./GroupUserLeave.service";

@Module({
  imports: [],
  controllers: [GroupUserLeaveController],
  providers: [GroupUserLeaveService]
})
export class GroupUserLeaveModule {
}

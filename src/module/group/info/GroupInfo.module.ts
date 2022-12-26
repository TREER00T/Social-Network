import { Module } from "@nestjs/common";
import { GroupInfoController } from "./GroupInfo.controller";
import { GroupInfoService } from "./GroupInfo.service";

@Module({
  imports: [],
  controllers: [GroupInfoController],
  providers: [GroupInfoService]
})
export class GroupInfoModule {
}

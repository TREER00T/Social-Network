import { Module } from "@nestjs/common";
import { GroupUserJoinController } from "./GroupUserJoin.controller";
import { GroupUserJoinService } from "./GroupUserJoin.service";

@Module({
  imports: [],
  controllers: [GroupUserJoinController],
  providers: [GroupUserJoinService]
})
export class GroupUserJoinModule {
}

import { Module } from "@nestjs/common";
import { GroupAdminController } from "./GroupAdmin.controller";
import { GroupAdminService } from "./GroupAdmin.service";

@Module({
  imports: [],
  controllers: [GroupAdminController],
  providers: [GroupAdminService]
})
export class GroupAdminModule {
}

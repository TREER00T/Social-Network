import { Module } from "@nestjs/common";
import { GroupAddAdminController } from "./GroupAddAdmin.controller";
import { GroupAddAdminService } from "./GroupAddAdmin.service";

@Module({
  imports: [],
  controllers: [GroupAddAdminController],
  providers: [GroupAddAdminService]
})
export class GroupAddAdminModule {
}

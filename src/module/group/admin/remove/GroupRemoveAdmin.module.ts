import { Module } from "@nestjs/common";
import { GroupRemoveAdminController } from "./GroupRemoveAdmin.controller";
import { GroupRemoveAdminService } from "./GroupRemoveAdmin.service";

@Module({
  imports: [],
  controllers: [GroupRemoveAdminController],
  providers: [GroupRemoveAdminService]
})
export class GroupRemoveAdminModule {
}

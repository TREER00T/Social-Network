import { Module } from "@nestjs/common";
import { GroupDescriptionController } from "./GroupDescription.controller";
import { GroupDescriptionService } from "./GroupDescription.service";

@Module({
  imports: [],
  controllers: [GroupDescriptionController],
  providers: [GroupDescriptionService]
})
export class GroupDescriptionModule {
}

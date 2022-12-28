import { Module } from "@nestjs/common";
import { GroupLinkController } from "./GroupLink.controller";
import { GroupLinkService } from "./GroupLink.service";

@Module({
  imports: [],
  controllers: [GroupLinkController],
  providers: [GroupLinkService]
})
export class GroupLinkModule {
}

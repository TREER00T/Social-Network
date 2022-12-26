import { Module } from "@nestjs/common";
import { GroupPublicLinkController } from "./GroupPublicLink.controller";
import { GroupPublicLinkService } from "./GroupPublicLink.service";

@Module({
  imports: [],
  controllers: [GroupPublicLinkController],
  providers: [GroupPublicLinkService]
})
export class GroupPublicLinkModule {
}

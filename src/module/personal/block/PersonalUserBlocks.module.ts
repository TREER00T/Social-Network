import {Module} from "@nestjs/common";
import {PersonalUserBlocksController} from "./PersonalUserBlocks.controller";
import {PersonalUserBlocksService} from "./PersonalUserBlocks.service";

@Module({
    controllers: [PersonalUserBlocksController],
    providers: [PersonalUserBlocksService]
})
export class PersonalUserBlocksModule {
}

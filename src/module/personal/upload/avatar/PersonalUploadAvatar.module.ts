import {Module} from "@nestjs/common";
import {PersonalUploadAvatarController} from "./PersonalUploadAvatar.controller";
import {PersonalUploadAvatarService} from "./PersonalUploadAvatar.service";

@Module({
    controllers: [PersonalUploadAvatarController],
    providers: [PersonalUploadAvatarService]
})
export class PersonalUploadAvatarModule {
}

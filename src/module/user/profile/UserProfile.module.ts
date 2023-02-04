import {Module} from "@nestjs/common";
import {UserProfileController} from "./UserProfile.controller";
import {UserProfileService} from "./UserProfile.service";

@Module({
    controllers: [UserProfileController],
    providers: [UserProfileService]
})
export class UserProfileModule {
}

import {Module} from "@nestjs/common";
import {PersonalAuthController} from "./PersonalAuth.controller";
import {PersonalAuthService} from "./PersonalAuth.service";

@Module({
    controllers: [PersonalAuthController],
    providers: [PersonalAuthService]
})
export class PersonalAuthModule {
}

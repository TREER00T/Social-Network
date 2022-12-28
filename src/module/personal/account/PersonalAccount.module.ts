import {Module} from "@nestjs/common";
import {PersonalAccountController} from "./PersonalAccount.controller";
import {PersonalAccount} from "./PersonalAccount.service";

@Module({
    controllers: [PersonalAccountController],
    providers: [PersonalAccount]
})
export class PersonalAccountModule {
}

import {Module} from "@nestjs/common";
import {E2EUserInfoController} from "./E2EUserInfo.controller";
import {E2EUserInfoService} from "./E2EUserInfo.service";

@Module({
    controllers: [E2EUserInfoController],
    providers: [E2EUserInfoService]
})
export class E2EUserInfoModule {
}

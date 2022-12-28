import {Module} from "@nestjs/common";
import {GenerateUserController} from "./GenerateUser.controller";
import {GenerateUserService} from "./GenerateUser.service";

@Module({
    controllers: [GenerateUserController],
    providers: [GenerateUserService]
})
export class GenerateUserModule {
}

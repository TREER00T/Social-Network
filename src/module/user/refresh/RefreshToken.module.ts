import {Module} from "@nestjs/common";
import {RefreshTokenController} from "./RefreshToken.controller";

@Module({
    controllers: [RefreshTokenController]
})
export class RefreshTokenModule {
}

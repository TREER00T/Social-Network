import {Module} from "@nestjs/common";
import {VerifyOTPController} from "./VerifyOTP.controller";
import {VerifyOTPService} from "./VerifyOTP.service";

@Module({
    controllers: [VerifyOTPController],
    providers: [VerifyOTPService]
})
export class VerifyOTPModule {
}

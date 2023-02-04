import {Body, Controller, Post, Request} from '@nestjs/common';
import {VerifyOTPService} from './VerifyOTP.service';
import {VerifyOTPDto} from "./VerifyOTP.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class VerifyOTPController {
    constructor(private readonly appService: VerifyOTPService) {
    }

    @Post()
    async validationOTPCode(@Body() dto: VerifyOTPDto, @Request() req) {

        let isValidCode = await this.appService.validationOTPCode(dto);

        if (!isValidCode)
            return Json.builder(Response.HTTP_UNAUTHORIZED);

        let havePassword = await this.appService.havePassword(dto.phone);

        if (!havePassword) {
            let data = await this.appService.generateTokenAndAddDeviceInfo(dto, req.ip, req.headers['user-agent']);
            let haveFirstName = await this.appService.haveFirstName(dto.phone);

            if (!haveFirstName) {
                delete data.apiKey;
                return Json.builder(Response.HTTP_OK_BUT_REQUIRE_FIRST_NAME, data);
            }

            await this.appService.logoutUser(dto.phone);

            return Json.builder(Response.HTTP_ACCEPTED, data);
        }

        await this.appService.updateApiKey(dto.phone);

        return Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION,
            await this.appService.generateToken(dto));

    }

}

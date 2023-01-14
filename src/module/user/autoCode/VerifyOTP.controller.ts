import {Body, Controller, Post} from '@nestjs/common';
import {VerifyOTPService} from './VerifyOTP.service';
import {VerifyOTPDto} from "./VerifyOTP.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class VerifyOTPController {
    constructor(private readonly appService: VerifyOTPService) {
    }

    @Post()
    async validationOTPCode(@Body() dto: VerifyOTPDto) {

        let isValidCode = await this.appService.validationOTPCode(dto);

        if (!isValidCode)
            return Json.builder(Response.HTTP_UNAUTHORIZED);

        let havePassword = await this.appService.havePassword(dto.phone);

        if (!havePassword)
            return Json.builder(Response.HTTP_ACCEPTED,
                await this.appService.generateTokenWithApiKey(dto));

        await this.appService.updateApiKey(dto.phone);

        return Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION,
            await this.appService.generateToken(dto));

    }

}

import {Body, Controller, Post} from '@nestjs/common';
import {VerifyAuthCodeService} from './VerifyAuthCode.service';
import {VerifyAuthCodeDto} from "./VerifyAuthCode.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class VerifyAuthCodeController {
    constructor(private readonly appService: VerifyAuthCodeService) {
    }

    @Post()
    async validationAuthCode(@Body() dto: VerifyAuthCodeDto) {

        let isValidCode = await this.appService.validationAuthCode(dto);

        if (!isValidCode)
            return Json.builder(Response.HTTP_UNAUTHORIZED);


        let havePassword = await this.appService.havePassword(dto.phone);

        if (!havePassword)
            return Json.builder(Response.HTTP_ACCEPTED, await this.appService.generateToken(dto));


        await this.appService.updateApiKey(dto.phone);

        return Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);

    }

}

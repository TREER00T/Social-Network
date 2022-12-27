import {Controller, Post, Body} from '@nestjs/common';
import {TwoStepService} from './TwoStep.service';
import {RefreshTokenDto} from "./RefreshToken.dto";
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class TwoStepController extends UserTokenManager {
    constructor(private readonly appService: TwoStepService) {
        super();
    }

    @Post()
    async validationPassword(@Body() dto: RefreshTokenDto) {
        await this.init();

        let isValidaPassword = await this.appService.isValidPassword(this.phoneNumber, dto.password);

        if (!isValidaPassword)
            return Json.builder(Response.HTTP_FORBIDDEN);


        Json.builder(Response.HTTP_ACCEPTED,
            await this.appService.getUserApiKey(this.phoneNumber, dto));
    }
}

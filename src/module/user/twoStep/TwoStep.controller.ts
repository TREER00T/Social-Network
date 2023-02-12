import {Controller, Post, Body, Request} from '@nestjs/common';
import {TwoStepService} from './TwoStep.service';
import {User} from "../../base/User";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {TwoStepDto} from "./TwoStep.dto";

@Controller()
export class TwoStepController extends User {
    constructor(private readonly appService: TwoStepService) {
        super();
    }

    @Post()
    async validationPassword(@Body() dto: TwoStepDto, @Request() req) {
        await this.init();

        let isValidPassword = await this.appService.isValidPassword(this.phoneNumber, dto.password);

        if (!isValidPassword)
            return Json.builder(Response.HTTP_FORBIDDEN);

        let haveFirstName = await this.appService.haveFirstName(this.phoneNumber);

        if (!haveFirstName)
            return Json.builder(Response.HTTP_OK_BUT_REQUIRE_FIRST_NAME);

        await this.appService.logoutUser(this.phoneNumber);

        return Json.builder(Response.HTTP_ACCEPTED,
            await this.appService.getUserApiKeyWithUserId(this.phoneNumber, dto, req.ip, req.headers['user-agent']));
    }
}

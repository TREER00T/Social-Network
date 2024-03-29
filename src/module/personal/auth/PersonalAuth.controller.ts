import {Body, Controller, Put} from '@nestjs/common';
import {PersonalAuthService} from './PersonalAuth.service';
import {LoginTwoRefactorCode} from "../../base/dto/LoginTwoRefactorCode";
import {User} from "../../base/User";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {AuthPasswordDto} from "./AuthPassword.dto";
import Generate from "../../../util/Generate";

@Controller()
export class PersonalAuthController extends User {
    constructor(private readonly appService: PersonalAuthService) {
        super();
    }

    @Put("/enable")
    async enableTwoAuth(@Body() dto: LoginTwoRefactorCode) {
        await this.init();

        await this.appService.twoAuth(this.phoneNumber, dto.email, dto.password);

        await this.appService.updateTwoStepVerificationState(this.phoneNumber, true);

        return Json.builder(Response.HTTP_OK);
    }

    @Put("/disable")
    async disableTwoAuth() {
        await this.init();

        await this.appService.twoAuth(this.phoneNumber);

        await this.appService.updateTwoStepVerificationState(this.phoneNumber, false);

        return Json.builder(Response.HTTP_OK);
    }

    @Put("/rest/password")
    async restPassword(@Body() dto: AuthPasswordDto) {
        await this.init();

        let oldPassword = dto.old,
            newPassword = dto.new;

        let isValidOldPassword = await this.appService.isValidPassword(
            this.phoneNumber, Generate.getHashData(oldPassword, this.phoneNumber));

        if (!isValidOldPassword)
            return Json.builder(Response.HTTP_FORBIDDEN);

        await this.appService.updatePassword(
            this.phoneNumber, Generate.getHashData(newPassword, this.phoneNumber));

        return Json.builder(Response.HTTP_OK);
    }


}

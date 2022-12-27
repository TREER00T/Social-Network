import {Body, Controller, Put} from '@nestjs/common';
import {PersonalAuthService} from './PersonalAuth.service';
import {LoginTwoRefactorCode} from "../../base/dto/LoginTwoRefactorCode";
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {AuthPasswordDto} from "./AuthPassword.dto";
import Generate from "../../../util/Generate";

@Controller()
export class PersonalAuthController extends UserTokenManager {
    constructor(private readonly appService: PersonalAuthService) {
        super();
    }

    @Put("/enable")
    async enableTwoAuth(@Body() dto: LoginTwoRefactorCode) {
        await this.init();

        await this.appService.twoAuth(this.phoneNumber, dto.email, dto.password);

        return Json.builder(Response.HTTP_OK);
    }

    @Put("/disable")
    async disableTwoAuth() {
        await this.appService.twoAuth(this.phoneNumber);

        return Json.builder(Response.HTTP_OK);
    }

    @Put("/rest/password")
    async restPassword(@Body() dto: AuthPasswordDto) {
        await this.init();

        let oldPassword = dto.old,
            newPassword = dto.new;

        let isValidPassword = await this.appService.isValidPassword(this.phoneNumber, Generate.getHashData(oldPassword, this.phoneNumber));

        if (!isValidPassword)
            return Json.builder(Response.HTTP_FORBIDDEN);

        await this.appService.updatePassword(this.phoneNumber, Generate.getHashData(newPassword, this.phoneNumber));

        return Json.builder(Response.HTTP_OK);
    }


}
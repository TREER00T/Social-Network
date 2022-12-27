import {Controller, Post} from '@nestjs/common';
import {RefreshTokenService} from './RefreshToken.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {UserTokenManager} from "../../base/UserTokenManager";
import Token from "../../../util/Token";

@Controller()
export class RefreshTokenController extends UserTokenManager {
    constructor(private readonly appService: RefreshTokenService) {
        super();
    }

    @Post()
    async refreshToken() {
        await this.init();

        let isExistUser = await this.appService.isExistUser(this.phoneNumber);

        if (!isExistUser)
            return Json.builder(Response.HTTP_FORBIDDEN);

        Json.builder(Response.HTTP_ACCEPTED, await Token.setup(this.phoneNumber, this.userId));

    }

}

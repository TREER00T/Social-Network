import {Controller, Post} from '@nestjs/common';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {UserTokenManager} from "../../base/UserTokenManager";
import Token from "../../../util/Token";

@Controller()
export class RefreshTokenController extends UserTokenManager {
    @Post()
    async refreshToken() {
        await this.init();

        return Json.builder(Response.HTTP_ACCEPTED, await Token.setup(this.phoneNumber, this.userId));
    }

}

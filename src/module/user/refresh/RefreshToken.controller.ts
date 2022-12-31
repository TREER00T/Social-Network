import {Controller, Post} from '@nestjs/common';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {User} from "../../base/User";
import Token from "../../../util/Token";

@Controller()
export class RefreshTokenController extends User {

    @Post()
    async refreshToken() {
        this.init();
        return Json.builder(Response.HTTP_ACCEPTED, await Token.setup(this.phoneNumber, this.userId));
    }

}

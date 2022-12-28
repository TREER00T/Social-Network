import {Controller, Delete} from '@nestjs/common';
import {PersonalAccount} from './PersonalAccount.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonalAccountController extends UserTokenManager {
    constructor(private readonly appService: PersonalAccount) {
        super()
    }

    @Delete()
    async deleteAccount() {
        await this.init();

        await this.appService.deleteAccount(this.phoneNumber, this.userId);

        return Json.builder(Response.HTTP_OK);
    }
}

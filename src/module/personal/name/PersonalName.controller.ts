import {Body, Controller, Put} from '@nestjs/common';
import {PersonalNameService} from './PersonalName.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import {PersonalNameDto} from "./PersonalName.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonalNameController extends UserTokenManager {
    constructor(private readonly appService: PersonalNameService) {
        super();
    }

    @Put()
    async updateFirstNameOrLastName(@Body() dto: PersonalNameDto) {
        await this.init();

        await this.appService.updateFirstNameOrLastName(this.userId, dto);

        return Json.builder(Response.HTTP_OK);
    }
}

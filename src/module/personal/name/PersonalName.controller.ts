import {Body, Controller, Put} from '@nestjs/common';
import {PersonalNameService} from './PersonalName.service';
import {User} from "../../base/User";
import {PersonalNameDto} from "./PersonalName.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonalNameController extends User {
    constructor(private readonly appService: PersonalNameService) {
        super();
    }

    @Put()
    async updateFirstNameOrLastName(@Body() dto: PersonalNameDto) {
        await this.init();

        await this.appService.updateFirstNameOrLastName(this.phoneNumber, dto);

        return Json.builder(Response.HTTP_OK);
    }
}

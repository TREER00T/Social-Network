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
        this.init();
    }

    @Put()
    async updateFirstNameOrLastName(@Body() dto: PersonalNameDto) {
        await this.appService.updateFirstNameOrLastName(this.userId, dto);

        return Json.builder(Response.HTTP_OK);
    }
}

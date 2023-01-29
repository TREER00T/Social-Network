import {Controller, Get} from '@nestjs/common';
import {PersonalDevicesService} from './PersonalDevices.service';
import {User} from "../../base/User";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonalDevicesController extends User {
    constructor(private readonly appService: PersonalDevicesService) {
        super();
    }

    @Get()
    async listOfDevices() {
        await this.init();

        return Json.builder(Response.HTTP_OK,
            await this.appService.listOfDevices(this.userId));
    }
}

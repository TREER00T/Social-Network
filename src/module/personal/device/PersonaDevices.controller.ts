import {Controller, Get} from '@nestjs/common';
import {PersonaDevicesService} from './PersonaDevices.service';
import {User} from "../../base/User";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonaDevicesController extends User {
    constructor(private readonly appService: PersonaDevicesService) {
        super();
    }

    @Get()
    async listOfDevices() {
        this.init();

        return Json.builder(Response.HTTP_OK,
            await this.appService.listOfDevices(this.userId));
    }
}

import {Controller, Get} from '@nestjs/common';
import {PersonaDevicesService} from './PersonaDevices.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonaDevicesController extends UserTokenManager {
    constructor(private readonly appService: PersonaDevicesService) {
        super();
    }

    @Get()
    async listOfDevices() {
        await this.init();

        Json.builder(Response.HTTP_OK,
            await this.appService.listOfDevices(this.userId));
    }
}

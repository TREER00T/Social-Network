import {Module} from "@nestjs/common";
import {PersonalDevicesController} from "./PersonalDevices.controller";
import {PersonalDevicesService} from "./PersonalDevices.service";

@Module({
    controllers: [PersonalDevicesController],
    providers: [PersonalDevicesService]
})
export class PersonalDevicesModule {
}

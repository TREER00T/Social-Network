import {Module} from "@nestjs/common";
import {PersonaDevicesController} from "./PersonaDevices.controller";
import {PersonaDevicesService} from "./PersonaDevices.service";

@Module({
    controllers: [PersonaDevicesController],
    providers: [PersonaDevicesService]
})
export class PersonaDevicesModule {
}

import {Module} from "@nestjs/common";
import {RoomsController} from "./Rooms.controller";
import {RoomsService} from "./Rooms.service";

@Module({
    controllers: [RoomsController],
    providers: [RoomsService]
})
export class RoomsModule {
}

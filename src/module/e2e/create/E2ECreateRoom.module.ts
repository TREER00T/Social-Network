import { Module } from "@nestjs/common";
import { E2ECreateRoomController } from "./E2ECreateRoom.controller";
import { E2ECreateRoomService } from "./E2ECreateRoom.service";

@Module({
  imports: [],
  controllers: [E2ECreateRoomController],
  providers: [E2ECreateRoomService]
})
export class E2ECreateRoomModule {
}

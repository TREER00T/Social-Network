import {Body, Controller, Get} from '@nestjs/common';
import {E2EMessage} from "../../base/E2EMessage";
import {RoomDataQuery} from "../../base/dto/RoomDataQuery";

@Controller()
export class E2EChatsController extends E2EMessage {
    @Get()
    async allChats(@Body() dto: RoomDataQuery) {
        await this.init();

        return await this.getListOfMessageFromRoom(dto, dto.roomId);
    }
}

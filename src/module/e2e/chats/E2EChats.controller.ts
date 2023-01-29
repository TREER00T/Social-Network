import {Body, Controller, Get} from '@nestjs/common';
import {DataQuery} from "../../base/dto/DataQuery";
import {E2EMessage} from "../../base/E2EMessage";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class E2EChatsController extends E2EMessage {
    @Get()
    async allChats(@Body() dto: DataQuery) {
        await this.init();

        let e2eChatName = await PromiseVerify.all([
            this.isUndefined(dto?.to),
            this.getNameOfE2EChat(dto.to)
        ]);

        if (typeof e2eChatName !== "string")
            return e2eChatName;

        return await this.getListOfMessageFromRoom(dto, e2eChatName);
    }
}

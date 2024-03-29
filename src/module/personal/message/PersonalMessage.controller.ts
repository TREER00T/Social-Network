import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {PersonalMessageService} from './PersonalMessage.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import Util from "../../../util/Util";
import {PersonalMessage} from "../../base/dto/PersonalMessage";
import {SavedMessage} from "../../base/SavedMessage";
import PromiseVerify from "../../base/PromiseVerify";
import {PersonalDataQuery} from "../../base/dto/PersonalDataQuery";
import {ListOfIdObject} from "../../../util/Types";

@Controller()
export class PersonalMessageController extends SavedMessage {
    constructor(private readonly appService: PersonalMessageService) {
        super();
    }

    @Get()
    async listOfMessage(@Query() dto: PersonalDataQuery) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        return await this.getListOfMessageFromRoom(dto, `${this.userId}SavedMessage`);
    }

    @Delete()
    async deleteMessage(@Body('listOfId') data: ListOfIdObject) {
        await this.init();

        if (!Util.isNotEmptyArr(data?.data))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.deleteOldFile(this.userId, data.data);
        await this.appService.removeMessageOrListOfMessage(this.userId, data?.data);

        return Json.builder(Response.HTTP_OK);
    }

    @Post()
    async addMessage(@Body() msg: PersonalMessage) {
        await this.init();

        let message = await this.handleSavedMessage(msg);

        if (message?.statusCode)
            return message;

        await this.appService.addMessage(this.userId, message);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Put()
    async updateMessage(@Body() msg: PersonalMessage) {
        await this.init();

        let messageId = msg?.messageId;
        if (!messageId)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        delete msg.messageId;

        let message = await this.handleSavedMessage(msg);

        if (message?.statusCode)
            return message;

        delete message?.messageCreatedBySenderId;
        delete message?.messageSentRoomId;

        await this.appService.updateMessage(this.userId, messageId, message);

        return Json.builder(Response.HTTP_OK);
    }

}

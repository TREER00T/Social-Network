import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {PersonalAccount} from './PersonalMessage.service';
import {DataQuery} from "../../base/dto/DataQuery";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import Util from "../../../util/Util";
import {Message} from "../../base/dto/Message";
import {InputException} from "../../../exception/InputException";
import {SavedMessage} from "../../base/SavedMessage";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class PersonalMessageController extends SavedMessage {
    constructor(private readonly appService: PersonalAccount) {
        super();
    }

    @Get()
    async listOfMessage(@Query() dto: DataQuery) {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        return await this.getListOfMessageFromRoom(dto, `${this.phoneNumber}SavedMessage`);
    }

    @Delete()
    async deleteMessage(@Body() data: string) {
        this.init();

        let messageIdOrListOfMessageId;

        try {
            messageIdOrListOfMessageId = JSON.parse(data)?.listOfId;
        } catch (e) {
            InputException(e);
        }

        if (Util.isUndefined(messageIdOrListOfMessageId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let haveErr = await PromiseVerify.all([
            this.verifySavedMessage()
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.removeMessageOrListOfMessage(this.phoneNumber, messageIdOrListOfMessageId);

        return Json.builder(Response.HTTP_OK);
    }

    @Post()
    async addMessage(@Body() msg: Message) {
        this.init();

        let message = await this.handleSavedMessage(msg);

        if (message?.code)
            return message;

        await this.appService.addMessage(this.phoneNumber, message);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Put()
    async updateMessage(@Body() msg: Message) {
        this.init();

        let message = await this.handleSavedMessage(msg);

        if (message?.code)
            return message;

        delete message?.id;

        await this.appService.updateMessage(this.phoneNumber, message.senderId, message);

        return Json.builder(Response.HTTP_OK);
    }

}

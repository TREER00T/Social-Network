import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {PersonalAccount} from './PersonalMessage.service';
import {DataQuery} from "../../base/dto/DataQuery";
import {UserTokenManager} from "../../base/UserTokenManager";
import {SavedMessageService} from "../savedMessage/SavedMessage.service";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import OptionQuerySearch from "../../../util/OptionQuerySearch";
import Util from "../../../util/Util";
import {Message} from "../../base/dto/Message";
import {InputException} from "../../../exception/InputException";

@Controller()
export class PersonalMessageController extends UserTokenManager {
    constructor(private readonly appService: PersonalAccount,
                private readonly savedMessageService: SavedMessageService) {
        super();
    }

    @Get()
    async listOfMessage(@Query() dto: DataQuery) {
        await this.init();

        let query = OptionQuerySearch.build(dto);

        let isSavedMessageCreated = await this.savedMessageService.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);


        let totalPages = await this.appService.listOfMessageCount(this.phoneNumber, query.limit);

        let listOfMessage = await this.appService.listOfMessage(this.phoneNumber, query);

        return Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );
    }

    @Delete()
    async deleteMessage(@Body() data: string) {
        await this.init();

        let messageIdOrListOfMessageId;

        try {
            messageIdOrListOfMessageId = JSON.parse(data)?.listOfId;
        } catch (e) {
            InputException(e);
        }

        if (Util.isUndefined(messageIdOrListOfMessageId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isSavedMessageCreated = await this.savedMessageService.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await this.appService.removeMessageOrListOfMessage(this.phoneNumber, messageIdOrListOfMessageId);

        return Json.builder(Response.HTTP_OK);
    }

    @Post()
    async addMessage(@Body() msg: Message) {
        let message = await this.handleMessage(msg);

        await this.appService.addMessage(this.phoneNumber, message);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Put()
    async updateMessage(@Body() msg: Message) {
        let message = await this.handleMessage(msg);

        delete message?.id;

        await this.appService.updateMessage(this.phoneNumber, message.senderId, message);

        return Json.builder(Response.HTTP_OK);
    }

    async handleMessage(msg: Message) {
        await this.init();

        let message = Util.validateMessage(msg);

        if (message === Util.IN_VALID_MESSAGE_TYPE || message === Util.IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        let isSavedMessageCreated = await this.savedMessageService.isSavedMessageCreated(this.phoneNumber);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        return message;
    }
}

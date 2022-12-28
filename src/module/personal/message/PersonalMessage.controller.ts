import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {PersonalAccount} from './PersonalMessage.service';
import {DataQuery} from "../../base/dto/DataQuery";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import OptionQuerySearch from "../../../util/OptionQuerySearch";
import Util from "../../../util/Util";
import {Message} from "../../base/dto/Message";
import {InputException} from "../../../exception/InputException";
import {SavedMessage} from "../../base/SavedMessage";

@Controller()
export class PersonalMessageController extends SavedMessage {
    constructor(private readonly appService: PersonalAccount) {
        super();
    }

    @Get()
    async listOfMessage(@Query() dto: DataQuery) {
        await this.init();

        let query = OptionQuerySearch.build(dto);

        this.verifySavedMessage().then(async () => {

            let totalPages = await this.getListOfMessageCount(`${this.phoneNumber}SavedMessage`, query.limit);

            let listOfMessage = await this.getListOfMessage(`${this.phoneNumber}SavedMessage`, query);

            return Json.builder(
                Response.HTTP_OK,
                listOfMessage, {
                    totalPages: totalPages
                }
            );

        });
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


        this.verifySavedMessage().then(async () => {

            await this.appService.removeMessageOrListOfMessage(this.phoneNumber, messageIdOrListOfMessageId);

            return Json.builder(Response.HTTP_OK);

        });
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

        return this.verifySavedMessage().then(() => message);
    }
}

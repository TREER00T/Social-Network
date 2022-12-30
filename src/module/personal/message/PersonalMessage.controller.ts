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
        this.init();
    }

    @Get()
    async listOfMessage(@Query() dto: DataQuery) {
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
        let message = await this.handleSavedMessage(msg);

        await this.appService.addMessage(this.phoneNumber, message);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Put()
    async updateMessage(@Body() msg: Message) {
        let message = await this.handleSavedMessage(msg);

        delete message?.id;

        await this.appService.updateMessage(this.phoneNumber, message.senderId, message);

        return Json.builder(Response.HTTP_OK);
    }

}

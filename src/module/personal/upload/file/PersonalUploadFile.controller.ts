import {Controller, Post, Body, UploadedFile, UseInterceptors} from '@nestjs/common';
import Json from "../../../../util/ReturnJson";
import Response from "../../../../util/Response";
import {FileInterceptor} from "@nestjs/platform-express";
import {Message} from "../../../base/dto/Message";
import {SavedMessage} from "../../../base/SavedMessage";
import PromiseVerify from "../../../base/PromiseVerify";

@Controller()
export class PersonalUploadFileController extends SavedMessage {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: Message) {
        this.init();

        let message = await PromiseVerify.all([
            this.isUndefined(file),
            this.verifySavedMessage(),
            this.handleMessage(msg)
        ]);

        if (message?.code)
            return message;

        return await this.saveAndGetId({
            file: {
                size: file.size,
                buffer: file.buffer,
                name: file.originalname
            },
            tableName: `${this.phoneNumber}SavedMessage`,
            message: message,
            conversationType: "Personal"
        });
    }
}

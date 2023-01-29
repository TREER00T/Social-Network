import {Controller, Post, Body, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {PersonalMessage} from "../../../base/dto/PersonalMessage";
import {SavedMessage} from "../../../base/SavedMessage";
import PromiseVerify from "../../../base/PromiseVerify";

@Controller()
export class PersonalUploadFileController extends SavedMessage {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async save(@UploadedFile() file: Express.Multer.File, @Body() msg: PersonalMessage) {
        await this.init();

        let message = await PromiseVerify.all([
            this.isUndefined(file),
            this.verifySavedMessage(),
            this.handleMessage(msg)
        ]);

        if (message?.statusCode)
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

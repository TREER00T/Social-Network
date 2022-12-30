import {Injectable} from '@nestjs/common';
import {Message} from "../../../base/dto/Message";
import CommonInsert from "../../../../model/add/common";

@Injectable()
export class ChannelUploadFileService {
    async uploadFileWithMessage(tableName: string, message: Message, conversationType: string) {
        return await CommonInsert.message(tableName, message, {
            conversationType: conversationType
        });
    }
}

import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import Util from "../../util/Util";
import {HandleMessage} from "./HandleMessage";
import PromiseVerify from "./PromiseVerify";
import {Message} from "./dto/Message";
import File from "../../util/File";
import OptionQuerySearch from "../../util/OptionQuerySearch";
import {DataQuery} from "./dto/DataQuery";

let CommonInsert = require("../../model/add/common"),
    Find = require("../../model/find/user");

type IFile = {
    size: number,
    buffer: ArrayBuffer,
    name: string
}

type MessagePayload = {
    file: IFile,
    tableName: string,
    message: Message,
    conversationType: string
}

export abstract class User extends HandleMessage {

    userId: string;
    phoneNumber: string;

    async init() {
        let tokenPayload = await Util.getTokenPayLoad();
        this.userId = tokenPayload.id;
        this.phoneNumber = tokenPayload.phone;
    }

    async verifyUser(userId) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(userId)
        ]);

        if (haveErr)
            return haveErr;

        let isUserExist = await Find.isExist(userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);
    }

    async saveAndGetId(data: MessagePayload) {
        let FileGenerated = await File.validationAndWriteFile({
            size: data.file.size,
            dataBinary: data.file.buffer,
            format: Util.getFileFormat(data.file.name)
        });

        data.message['fileUrl'] = FileGenerated.url;
        data.message['fileSize'] = FileGenerated.size;
        data.message['fileName'] = data.file.name;

        let insertedId = await CommonInsert.message(data.tableName, data.message, {
            conversationType: data.conversationType
        });

        return Json.builder(Response.HTTP_CREATED, {
            insertedId: insertedId
        });
    }

    async getListOfMessageFromRoom(dto: DataQuery, tableName: string) {
        let query = OptionQuerySearch.build(dto);

        let totalPages = await this.getListOfMessageCount(tableName, query.limit);

        let listOfMessage = await this.getListOfMessage(tableName, query);

        return Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );
    }

}
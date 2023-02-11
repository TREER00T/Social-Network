import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import Util from "../../util/Util";
import {HandleMessage} from "./HandleMessage";
import PromiseVerify from "./PromiseVerify";
import File from "../../util/File";
import OptionQuerySearch from "../../util/OptionQuerySearch";
import {ListOfAdmin, ListOfUserTargetId, MessagePayload, UserIdWithType} from "../../util/Types";
import CommonInsert from "../../model/add/common";
import Find from "../../model/find/user";
import {PersonalDataQuery} from "./dto/PersonalDataQuery";
import {RoomDataQuery} from "./dto/RoomDataQuery";
import {UserIdDto} from "../e2e/info/UserId.dto";

export abstract class User extends HandleMessage {

    userId: string;
    phoneNumber: string;

    async init() {
        let tokenPayload = await Util.getTokenPayLoad();
        this.userId = tokenPayload.id;
        this.phoneNumber = tokenPayload.phoneNumber;
    }

    async verifyUser(userId: string | UserIdWithType) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(userId)
        ]);

        if (haveErr)
            return haveErr;

        let isUserExist = await Find.isExist(userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_NOT_FOUND);

        let hasLogout = await Find.hasLogout(this.userId);

        if (hasLogout)
            return Json.builder(Response.HTTP_UNAUTHORIZED);
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

        let insertedId = await CommonInsert.message(data.tableName, data.message);

        return Json.builder(Response.HTTP_CREATED, {
            insertedId: insertedId
        });
    }

    async getListOfMessageFromRoom(dto: RoomDataQuery | PersonalDataQuery, tableName: string) {
        let query = OptionQuerySearch.build(dto);

        let listOfMessage = await this.getListOfMessage(tableName, query);

        return Json.builder(
            Response.HTTP_OK,
            listOfMessage
        );
    }

    async userDetails(listOfUserId: ListOfUserTargetId | ListOfAdmin) {
        return await Find.getUserDetailsInUsersTable(listOfUserId);
    }

    async handleUserId(dto: UserIdDto) {
        if (Util.isUndefined(dto?.userId) && Util.isUndefined(dto?.username))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let data;

        if (dto?.userId)
            data = {type: '_id', id: dto.userId};

        if (dto?.username)
            data = {type: 'username', id: dto.username};

        return data;
    }

}
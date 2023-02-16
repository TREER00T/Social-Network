import {SocketGatewayController} from "../SocketGateway.controller";
import CommonFind from "../../../model/find/common";
import FindInUser from "../../../model/find/user";
import FindInGroup from "../../../model/find/group";
import FindInChannel from "../../../model/find/channel";
import {ListOfFileUrl, RoomTypeWithOutPersonal} from "../../../util/Types";
import File from "../../../util/File";

export class AbstractRoom extends SocketGatewayController {

    async isUserMessage(userId: string, messageId: string | string[], tableName: string) {
        return await CommonFind.isMessageBelongForThisUserInRoom(messageId, userId, tableName);
    }

    async deleteOldFiles(roomType: RoomTypeWithOutPersonal, roomId: string, list: string[]) {
        let listOfUrl: ListOfFileUrl = await FindInUser.getListOfUploadedFileUrl(roomType, roomId, list);

        listOfUrl.map(async d => {
            await File.deleteOldFile(d.fileUrl);
        });
    }

    async getMessageInRoom(roomType: RoomTypeWithOutPersonal, messageId: string, roomId: string) {
        if (roomType === 'group')
            return await FindInGroup.getMessage(messageId, roomId);

        if (roomType === 'channel')
            return await FindInChannel.getMessage(messageId, roomId);

        return await FindInUser.getMessage(messageId, roomId);
    }

}
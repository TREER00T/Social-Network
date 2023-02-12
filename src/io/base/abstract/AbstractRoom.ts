import {SocketGatewayController} from "../SocketGateway.controller";
import CommonFind from "../../../model/find/common";
import FindInUser from "../../../model/find/user";
import {ListOfFileUrl, RoomType} from "../../../util/Types";
import File from "../../../util/File";

export class AbstractRoom extends SocketGatewayController {

    async isUserMessage(userId: string, messageId: string | string[], tableName: string) {
        return await CommonFind.isMessageBelongForThisUserInRoom(messageId, userId, tableName);
    }

    async deleteOldFiles(roomType: RoomType, roomId: string, list: string[]) {
        let listOfUrl: ListOfFileUrl = await FindInUser.getListOfUploadedFileUrl(roomType, roomId, list);

        listOfUrl.map(async d => {
            await File.deleteOldFile(d.fileUrl);
        });
    }

}
import {SocketGatewayController} from "../SocketGateway.controller";

let CommonFind = require("../../../model/find/common");

export class AbstractRoom extends SocketGatewayController {

    async isUserMessage(userId: string, messageId: string | string[], tableName: string) {
        return await CommonFind.isMessageBelongForThisUserInRoom(messageId, userId, tableName);
    }

}
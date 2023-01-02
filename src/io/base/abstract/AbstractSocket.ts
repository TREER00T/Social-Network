import {SocketGatewayController} from "../SocketGateway.controller";

let Find = require("../../../model/find/user");

export abstract class E2EAbstract extends SocketGatewayController {

    async isBlocked(senderId: string, receiverId: string) {
        return await Find.isBlock(senderId, receiverId);
    }

}
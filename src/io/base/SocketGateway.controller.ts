import {Controller, Logger} from '@nestjs/common';
import * as dotenv from "dotenv";
import {
    OnGatewayInit,
    WebSocketServer,
    OnGatewayDisconnect,
    OnGatewayConnection
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {SocketGatewayService} from "./SocketGateway.service";
import Util from "../../util/Util";

let Redis = require("../../database/redisDbDriver");

dotenv.config();

type Users = {
    [key: string]: string
}

@Controller()
export class SocketGatewayController implements OnGatewayDisconnect, OnGatewayInit, OnGatewayConnection {

    private readonly appService: SocketGatewayService = new SocketGatewayService();

    private users: Users = {};

    private logger: Logger = new Logger('SocketIoService');

    afterInit(server: any) {
        this.logger.log('Initialized...');
    }

    @WebSocketServer()
    io: Server;

    async handleDisconnect(client: Socket) {
        let socketId = client.id;

        Redis.get(socketId)
            .then(async (socket) => {
                delete this.users[socketId];
                await this.appService.updateUserStatus(socket.id, 0);
                await this.appService.sendUserOnlineStatusForSpecificUsers(this.io, false, socket.id);
            })
            .then(async () => await Redis.remove(socketId));
    }

    async handleConnection(client: Socket, ...args: any[]) {
        let accessToken: string = client.handshake.headers?.authorization;
        let userApiKey = client.handshake.query?.apiKey;
        let socketId = client.id;

        let isExistUserInRedis = await Redis.get(socketId);

        if (isExistUserInRedis)
            return false;

        let isValidToken = await Util.isAccessToken(accessToken);

        if (!isValidToken)
            return false;


        let tokenPayload = await Util.getTokenPayLoad();

        let userPhone = tokenPayload.phoneNumber,
            userId = tokenPayload.id;

        let isValidApiKey = await Util.isValidApiKey(userPhone, userApiKey?.toString());

        if (isValidApiKey) {
            await Redis.set(userId, {
                phone: userPhone,
                id: userId,
                socketId: socketId
            });

            await this.appService.updateUserStatus(userId, 1);
            await this.appService.sendUserOnlineStatusForSpecificUsers(this.io, true, userId);
            this.users[socketId] = userId;

            return true;
        }

    }

}
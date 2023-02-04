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
import Response from "../../util/Response";
import {HandleMessage} from "../../module/base/HandleMessage";
import {TSaveMessage, Users} from "../../util/Types";
import CommonDelete from "../../model/remove/common";
import CommonInsert from "../../model/add/common";

let Redis = require("../../database/redisDbDriver"),
    CommonUpdate = require("../../model/update/common");

dotenv.config();

@Controller()
export class SocketGatewayController extends HandleMessage implements OnGatewayDisconnect, OnGatewayInit, OnGatewayConnection {

    private readonly socketGatewayService: SocketGatewayService = new SocketGatewayService();

    private users: Users = {};

    protected canActive: boolean = false;

    private logger: Logger = new Logger('SocketIoService');

    afterInit(server: any) {
        this.logger.log('Initialized...');
    }

    @WebSocketServer()
    io: Server;

    async handleDisconnect(client: Socket) {
        let socketId = client.id;

        if (this.canActive) {
            Redis.get(this.getUserId(socketId))
                .then(async (socket) => {
                    delete this.users[socketId];
                    await this.socketGatewayService.updateUserStatus(socket.id, 0);
                    await this.socketGatewayService.sendUserOnlineStatusForSpecificUsers(this.io, false, socket.id);
                })
                .then(async () => await Redis.remove(socketId));
        }
    }

    async handleConnection(client: Socket, ...args: any[]) {
        let accessToken: string = client.handshake.headers?.authorization;
        let userApiKey = client.handshake.query?.apiKey;
        let socketId = client.id;

        let isExistUserInRedis = await Redis.get(socketId);

        if (isExistUserInRedis)
            return this.canActive = true;

        let isValidToken = await Util.isAccessToken(accessToken);

        if (!isValidToken)
            return this.canActive = false;


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

            await this.socketGatewayService.updateUserStatus(userId, 1);
            await this.socketGatewayService.sendUserOnlineStatusForSpecificUsers(this.io, true, userId);
            this.users[socketId] = userId;

            return this.canActive = true;
        }

        return this.canActive = false;
    }

    handleUserJoinState(socket: Socket, roomId: string, type: string) {
        let isRoomAddedInSocketList = this.io.sockets.adapter.rooms.get(roomId + type);

        if (!isRoomAddedInSocketList)
            socket.join(roomId + type);
    }

    leaveUserFromRoom(socket: Socket, roomId: string, type: string) {
        let isRoomAddedInSocketList = this.io.sockets.adapter.rooms.get(roomId + type);

        if (isRoomAddedInSocketList)
            socket.leave(roomId + type);
    }

    emitToSpecificSocket =
        (where: string, emitName: string, data: object) => this.io.to(where).emit(emitName, data);

    async isExistChatRoom(socket: Socket, receiverId: string, errEmitName: string): Promise<string | boolean> {
        let user = await Redis.get(receiverId),
            socketId = user?.socketId;

        let isExistChat = await this.socketGatewayService.isExistChat(receiverId, user.id);

        if (!isExistChat) {
            socket.emit(errEmitName, Response.HTTP_NOT_FOUND);
            return false;
        }

        return !socketId ? 'SOCKET_OFFLINE' : socketId;
    }

    getUserId(socketId: string) {
        return this.users[socketId];
    }

    async saveMessage(data: TSaveMessage) {
        await CommonInsert.message(data.tableName, data.message);
    }

    async updateMessage(data: TSaveMessage, messageId: string) {
        await CommonUpdate.message(data.tableName, data.message, messageId);
    }

    async removeMessage(tableName: string, listOfId: string[]) {
        await CommonDelete.message(tableName, listOfId);
    }

}
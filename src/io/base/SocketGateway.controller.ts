import {Controller, Logger} from '@nestjs/common';
import * as dotenv from "dotenv";
import {
    OnGatewayInit,
    WebSocketServer,
    OnGatewayDisconnect,
    OnGatewayConnection, ConnectedSocket
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {SocketGatewayService} from "./SocketGateway.service";
import Util from "../../util/Util";
import Response from "../../util/Response";
import {HandleMessage} from "../../module/base/HandleMessage";
import {TSaveMessage} from "../../util/Types";
import CommonDelete from "../../model/remove/common";
import CommonInsert from "../../model/add/common";

let Redis = require("../../database/redisDbDriver"),
    CommonUpdate = require("../../model/update/common");

dotenv.config();

@Controller()
export class SocketGatewayController extends HandleMessage implements OnGatewayDisconnect, OnGatewayInit, OnGatewayConnection {

    private readonly socketGatewayService: SocketGatewayService = new SocketGatewayService();

    private users = new Map();

    private logger: Logger = new Logger('SocketIoService');

    afterInit(server: any) {
        this.logger.log('Initialized...');
    }

    @WebSocketServer()
    io: Server;

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        let socketId = client.id;

        let socket = await Redis.get(await this.getUserId(socketId));

        if (socket?.group || socket?.channel) {
            socket?.group?.forEach(id => client.leave(id));
            socket?.channel?.forEach(id => client.leave(id));
        }

        this.users.delete(socketId);
        await Redis.remove(socketId);
        await this.socketGatewayService.sendListOfUserOnlineStatusForSpecificUser(this.io, socket.id, false);
        await this.socketGatewayService.updateUserStatus(socket.id, false);
    }

    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        let accessToken: string = client.handshake.headers?.authorization;
        let userApiKey = client.handshake.query?.apiKey;
        let socketId = client.id;

        let isValidToken = await Util.isAccessToken(accessToken);

        if (!isValidToken) {
            client.disconnect(true);
            return;
        }

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

            await this.socketGatewayService.sendListOfUserOnlineStatusForSpecificUser(this.io, userId, true);
            await this.socketGatewayService.updateUserStatus(userId, true);

            this.users.set(socketId, userId);
            return;
        }

        client.disconnect(true);
    }

    async handleUserJoinState(socket: Socket, roomId: string, type: string) {
        let isRoomAddedInSocketList = socket.rooms.has(roomId + type);

        if (!isRoomAddedInSocketList) {
            let user = await Redis.get(await this.getUserId(socket.id));
            let existRoomArr = user?.[type] ?? [];
            existRoomArr.push(roomId);
            delete user?.[type];
            await Redis.set(user.id, {...user, [type]: existRoomArr})
            socket.join(roomId + type);
        }
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

    async getUserId(socketId: string) {
        return await this.users.get(socketId);
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
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
import {TSaveMessage} from "../../util/Types";
import CommonDelete from "../../model/remove/common";
import CommonInsert from "../../model/add/common";

let Redis = require("../../database/redisDbDriver"),
    CommonUpdate = require("../../model/update/common");

dotenv.config();

type Users = {
    [key: string]: string
}

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

        Redis.get(socketId)
            .then(async (socket) => {
                delete this.users[socketId];
                await this.socketGatewayService.updateUserStatus(socket.id, 0);
                await this.socketGatewayService.sendUserOnlineStatusForSpecificUsers(this.io, false, socket.id);
            })
            .then(async () => await Redis.remove(socketId));

        this.leaveUserInAllRooms(client);
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

    joinUserInRoom(socket: Socket, roomId: string, type: string) {
        if (!this.io.sockets.adapter.rooms.get(roomId + type)) {
            socket.join(roomId + type);

            if (!this.users[socket.id][type + 'Rooms'])
                this.users[socket.id][type + 'Rooms'] = [];

            this.users[socket.id][type + 'Rooms'].push(roomId + type);
        }
    }

    leaveUserInRoom(socket: Socket, roomId: string, type: string) {
        let isRoomAddedInList = this.users[socket.id][type + 'Rooms']?.includes(roomId + type);

        if (isRoomAddedInList) {
            socket.leave(roomId + type);

            let index = this.users[socket.id][type + 'Rooms']?.indexOf(roomId);
            this.users[socket.id][type + 'Rooms']?.splice(index, 1);
        }
    }

    leaveUserInAllRooms(socket: Socket) {
        let arrayOfRoomTypes = ['channel', 'group'];
        arrayOfRoomTypes.forEach(typeRoom => {
            this.users[socket.id][typeRoom + 'Rooms']?.forEach(item => {
                socket.leave(item + typeRoom);
            });
        });
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
        await CommonInsert.message(data.tableName, data.message, {
            conversationType: data.conversationType
        });
    }

    async updateMessage(data: TSaveMessage, messageId: string) {
        await CommonUpdate.message(data.tableName, data.message, {
            messageId: messageId
        });
    }

    async removeMessage(tableName: string, listOfId: string[]) {
        await CommonDelete.message(tableName, listOfId);
    }

}
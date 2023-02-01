import {Controller} from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import {Socket} from "socket.io";
import PromiseVerify from "../../module/base/PromiseVerify";
import {E2EService} from "./E2E.service";
import Response from "../../util/Response";
import {JsonObject} from "../../util/Types";
import {AbstractRoom} from "../base/abstract/AbstractRoom";

@WebSocketGateway(Number(process.env.SOCKET_IO_PORT), {
    namespace: '/e2e',
    cors: true
})
@Controller()
export class E2EController extends AbstractRoom {

    private readonly appService: E2EService = new E2EService();

    @SubscribeMessage("onPvTyping")
    async pvTyping(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let d = await this.verifyPv(socket, 'emitPvTypingError', data);

        if (typeof d !== "object")
            return;

        data.senderId = d.senderId;

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvTyping', data);
    }

    @SubscribeMessage("onPvMessage")
    async sendPvMessage(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let d = await this.verifyPv(socket, 'emitPvMessageError', data);

        if (typeof d !== "object")
            return;

        let haveErr = PromiseVerify.all([
            this.isUndefined(data?.roomId)
        ]);

        if (haveErr)
            return socket.emit('emitPvMessageError', haveErr);

        data.messageCreatedBySenderId = d.senderId;
        data.messageSentRoomId = data.roomId;

        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitPvMessageError', message);

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvMessage', message);

        await this.saveMessage({
            conversationType: 'E2E',
            tableName: data.roomId,
            message: message
        });
    }

    @SubscribeMessage("onPvEditMessage")
    async updatePvMessage(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let messageId = data?.messageId,
            roomId = data?.roomId;

        let d = await this.verifyPv(socket, 'emitPvEditMessageError', data);

        if (typeof d !== "object")
            return;

        let haveErr = await PromiseVerify.all([
            this.isUndefined(messageId),
            this.isUndefined(roomId)
        ]);

        if (haveErr)
            return socket.emit('emitPvEditMessageError', haveErr);

        let isUserMessage = this.isUserMessage(d.senderId, messageId, roomId);

        if (!isUserMessage)
            return socket.emit('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

        delete data.messageId;
        delete data?.roomType;
        delete data?.messageCreatedBySenderId;
        delete data?.messageSentRoomId;

        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitPvEditMessageError', message);

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvEditMessage', message);

        await this.updateMessage({
            tableName: roomId,
            message: message
        }, messageId);
    }

    @SubscribeMessage("onPvDeleteMessage")
    async removePvMessage(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let listOfId = data?.listOfId,
            roomId = data?.roomId;

        let haveErr = PromiseVerify.all([
            this.isUndefined(roomId)
        ]);

        if (haveErr)
            return socket.emit('emitPvMessageError', haveErr);

        if (!Array.isArray(listOfId) && listOfId.length === 0)
            return socket.emit('emitPvDeleteMessageError', Response.HTTP_BAD_REQUEST);


        let d = await this.verifyPv(socket, 'emitPvDeleteMessageError', data);

        if (typeof d !== "object")
            return;

        let isUserMessage = this.isUserMessage(d.senderId, listOfId, roomId);

        if (!isUserMessage)
            return socket.emit('emitPvDeleteMessageError', Response.HTTP_FORBIDDEN);

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvDeleteMessage', Response.HTTP_OK);

        await this.removeMessage(roomId, listOfId);
    }

    async verifyPv(socket: Socket, errEmit: string, data: JsonObject) {
        let receiverId = data?.receiverId;

        let haveErr = await PromiseVerify.all([
            this.isUndefined(receiverId)
        ]);

        if (haveErr)
            return socket.emit(errEmit, haveErr);

        let receiverSocketId = await this.isExistChatRoom(socket, receiverId, errEmit);

        if (!receiverSocketId || receiverSocketId === 'SOCKET_OFFLINE')
            return true;

        let senderId = this.getUserId(socket.id);

        let isUserBlocked = await this.appService.isBlocked(senderId, receiverId);

        if (!isUserBlocked)
            return socket.emit(errEmit, Response.HTTP_FORBIDDEN);

        return {
            receiverSocketId: receiverSocketId,
            senderId: senderId
        }
    }

}
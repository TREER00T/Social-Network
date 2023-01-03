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
    namespace: '/e2e'
})
@Controller()
export class E2EController extends AbstractRoom {

    private readonly appService: E2EService = new E2EService();

    @SubscribeMessage("onPvTyping")
    async pvTyping(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let d = await this.verifyPv(socket, 'emitPvTypingError', data);

        if (typeof d !== "object")
            return;

        delete data.receiverId;

        data.senderId = d.senderId;

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvTyping', data);
    }

    @SubscribeMessage("onPvMessage")
    async sendPvMessage(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let d = await this.verifyPv(socket, 'emitPvMessageError', data);

        if (typeof d !== "object")
            return;

        let receiverId = data.receiverId;

        delete data.receiverId;

        data.senderId = d.senderId;


        let message = await this.handleMessage(data);

        if (message?.code)
            return socket.emit('emitPvMessage', message);

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvMessage', message);

        await this.saveMessage({
            conversationType: 'E2E',
            tableName: `${d.senderId}And${receiverId}E2EContents`,
            message: message
        });
    }

    @SubscribeMessage("onPvEditMessage")
    async updatePvMessage(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let messageId = data?.messageId;

        let haveErr = await PromiseVerify.all([
            this.isUndefined(messageId)
        ]);

        if (haveErr)
            return socket.emit('emitPvEditMessageError', haveErr);


        let d = await this.verifyPv(socket, 'emitPvEditMessageError', data);

        if (typeof d !== "object")
            return;

        let receiverId = data.receiverId;
        let isUserMessage = this.isUserMessage(d.senderId, messageId, `${d.senderId}And${receiverId}E2EContents`);

        if (!isUserMessage)
            return socket.emit('emitPvEditMessageError', Response.HTTP_FORBIDDEN);

        delete data.receiverId;
        delete data.messageId;

        data.senderId = d.senderId;


        let message = await this.handleMessage(data);

        if (message?.code)
            return socket.emit('emitPvEditMessage', message);

        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvEditMessage', message);

        await this.updateMessage({
            tableName: `${d.senderId}And${receiverId}E2EContents`,
            message: message
        }, messageId);
    }

    @SubscribeMessage("onPvDeleteMessage")
    async removePvMessage(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let listOfId = data?.listOfId;

        if (!Array.isArray(listOfId) && listOfId.length === 0)
            return socket.emit('emitPvDeleteMessageError', Response.HTTP_BAD_REQUEST);


        let d = await this.verifyPv(socket, 'emitPvDeleteMessageError', data);

        if (typeof d !== "object")
            return;

        let receiverId = data.receiverId;
        let isUserMessage = this.isUserMessage(d.senderId, listOfId, `${d.senderId}And${receiverId}E2EContents`);

        if (!isUserMessage)
            return socket.emit('emitPvDeleteMessageError', Response.HTTP_FORBIDDEN);


        this.emitToSpecificSocket(d.receiverSocketId.toString(), 'emitPvDeleteMessage', Response.HTTP_OK);

        await this.removeMessage(`${d.senderId}And${receiverId}E2EContents`, listOfId);
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
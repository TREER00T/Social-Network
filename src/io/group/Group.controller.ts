import {Controller} from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import {JsonObject} from "../../util/Types";
import {Socket} from "socket.io";
import PromiseVerify from "../../module/base/PromiseVerify";
import {AbstractGroup} from "../base/abstract/AbstractGroup";
import Response from "../../util/Response";

@WebSocketGateway(Number(process.env.SOCKET_IO_PORT), {
    namespace: '/group',
    cors: true
})
@Controller()
export class GroupController extends AbstractGroup {

    @SubscribeMessage("onGroupSendMessage")
    async sendMessageInGroup(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let groupId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitGroupSendMessageError', haveErr);

        delete data.roomId;
        data.messageCreatedBySenderId = senderId;
        data.messageSentRoomId = `${groupId}GroupContents`;

        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitGroupSendMessageError', message);

        await this.handleUserJoinState(socket, groupId, 'group');

        this.emitToSpecificSocket(groupId, 'emitGroupSendMessage', message);

        await this.saveMessage({
            tableName: data.messageSentRoomId,
            message: message
        });
    }

    @SubscribeMessage("onGroupEditMessage")
    async updateMessageInGroup(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let messageId = data?.messageId,
            groupId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(messageId),
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitGroupEditMessageError', haveErr);

        await this.handleUserJoinState(socket, groupId, 'group');

        let isUserMessage = this.isUserMessage(senderId, messageId, `${groupId}GroupContents`);

        if (!isUserMessage)
            return socket.emit('emitGroupEditMessageError', Response.HTTP_FORBIDDEN);

        delete data.roomId;
        delete data.messageId;
        delete data?.messageCreatedBySenderId;
        delete data?.messageSentRoomId;

        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitGroupEditMessageError', message);

        this.emitToSpecificSocket(groupId, 'emitGroupEditMessage', message);

        await this.updateMessage({
            tableName: `${groupId}GroupContents`,
            message: message
        }, messageId);
    }

    @SubscribeMessage("onGroupDeleteMessage")
    async removeMessageInGroup(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let listOfId = data?.listOfId,
            groupId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        if (!Array.isArray(listOfId) && listOfId.length === 0)
            return socket.emit('emitGroupDeleteMessageError', Response.HTTP_BAD_REQUEST);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitGroupDeleteMessageError', haveErr);


        let isUserMessage = this.isUserMessage(senderId, listOfId, `${groupId}GroupContents`);

        if (!isUserMessage)
            return socket.emit('emitGroupDeleteMessageError', Response.HTTP_FORBIDDEN);

        await this.handleUserJoinState(socket, groupId, 'group');

        this.emitToSpecificSocket(groupId, 'emitGroupDeleteMessage', Response.HTTP_OK);

        await this.deleteOldFiles('group', groupId, listOfId);
        await this.removeMessage(`${groupId}GroupContents`, listOfId);
    }

    @SubscribeMessage("onGroupSpecificMessage")
    async getSpecificItem(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let insertedId = data?.insertedId,
            groupId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(insertedId),
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitGroupSpecificMessageError', haveErr);

        this.emitToSpecificSocket(groupId, 'emitGroupSpecificMessage',
            await this.getMessageInRoom('group', insertedId, groupId));
    }

}
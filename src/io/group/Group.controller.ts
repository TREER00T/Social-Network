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

    @SubscribeMessage("onLeaveUserFromGroup")
    async leaveUserFromGroup(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let groupId = data?.roomId;

        let haveErr = PromiseVerify.all([
            this.isUndefined(groupId),
            this.isGroupExist(groupId)
        ]);

        if (haveErr)
            return socket.emit('emitLeaveUserFromGroupError', haveErr);

        this.handleUserJoinState(socket, groupId, 'group');
        socket.emit('emitLeaveUserFromGroup', Response.HTTP_OK);
    }

    @SubscribeMessage("onGroupMessage")
    async sendMessageInGroup(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let groupId = data?.roomId,
            senderId = this.getUserId(socket.id);

        let haveErr = PromiseVerify.all([
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitGroupMessageError', haveErr);

        delete data.roomId;
        data.senderId = senderId;


        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitGroupMessage', message);

        this.handleUserJoinState(socket, groupId, 'group');

        this.emitToSpecificSocket(groupId, 'emitGroupMessage', message);

        await this.saveMessage({
            conversationType: 'Group',
            tableName: `${groupId}GroupContents`,
            message: message
        });
    }


    @SubscribeMessage("onGroupEditMessage")
    async updateMessageInGroup(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let messageId = data?.messageId,
            groupId = data?.roomId,
            senderId = this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(messageId),
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitGroupEditMessageError', haveErr);

        this.handleUserJoinState(socket, groupId, 'group');

        let isUserMessage = this.isUserMessage(senderId, messageId, `${groupId}GroupContents`);

        if (!isUserMessage)
            return socket.emit('emitGroupEditMessageError', Response.HTTP_FORBIDDEN);

        delete data.roomId;
        delete data.messageId;

        data.senderId = senderId;


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
            senderId = this.getUserId(socket.id);

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

        this.handleUserJoinState(socket, groupId, 'group');

        this.emitToSpecificSocket(groupId, 'emitGroupDeleteMessage', Response.HTTP_OK);

        await this.removeMessage(`${groupId}GroupContents`, listOfId);
    }

}
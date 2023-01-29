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
import Response from "../../util/Response";
import {AbstractChannel} from "../base/abstract/AbstractChannel";

@WebSocketGateway(Number(process.env.SOCKET_IO_PORT), {
    namespace: '/channel',
    cors: true
})
@Controller()
export class ChannelController extends AbstractChannel {

    @SubscribeMessage("onLeaveUserChannel")
    async leaveUserFromChannel(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let channelId = data?.roomId;

        let haveErr = PromiseVerify.all([
            this.isUndefined(channelId),
            this.isChannelExist(channelId)
        ]);

        if (haveErr)
            return socket.emit('emitLeaveChannelError', haveErr);

        this.handleUserJoinState(socket, channelId, 'channel');

        socket.emit('emitLeaveUserFromChannel', Response.HTTP_OK);
    }

    @SubscribeMessage("onChannelMessage")
    async sendMessageInChannel(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let channelId = data?.roomId,
            senderId = this.getUserId(socket.id);

        let haveErr = PromiseVerify.all([
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId, senderId),
            this.isOwnerOrAdmin(channelId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitChannelMessageError', haveErr);

        delete data.roomId;
        data.senderId = senderId;


        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitChannelMessage', message);

        this.handleUserJoinState(socket, channelId, 'channel');

        this.emitToSpecificSocket(channelId, 'emitChannelMessage', message);

        await this.saveMessage({
            conversationType: 'Channel',
            tableName: `${channelId}ChannelContents`,
            message: message
        });
    }


    @SubscribeMessage("onChannelEditMessage")
    async updateMessageInChannel(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let messageId = data?.messageId,
            channelId = data?.roomId,
            senderId = this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(messageId),
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId, senderId),
            this.isOwnerOrAdmin(channelId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitChannelEditMessageError', haveErr);

        this.handleUserJoinState(socket, channelId, 'channel');

        let isUserMessage = this.isUserMessage(senderId, messageId, `${channelId}ChannelContents`);

        if (!isUserMessage)
            return socket.emit('emitChannelEditMessageError', Response.HTTP_FORBIDDEN);

        delete data.roomId;
        delete data.messageId;

        data.senderId = senderId;


        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitChannelEditMessageError', message);

        this.emitToSpecificSocket(channelId, 'emitChannelEditMessage', message);

        await this.updateMessage({
            tableName: `${channelId}ChannelContents`,
            message: message
        }, messageId);
    }

    @SubscribeMessage("onChannelDeleteMessage")
    async removeMessageInChannel(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let listOfId = data?.listOfId,
            channelId = data?.roomId,
            senderId = this.getUserId(socket.id);

        if (!Array.isArray(listOfId) && listOfId.length === 0)
            return socket.emit('emitChannelDeleteMessageError', Response.HTTP_BAD_REQUEST);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId, senderId),
            this.isOwnerOrAdmin(channelId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitChannelDeleteMessageError', haveErr);


        let isUserMessage = this.isUserMessage(senderId, listOfId, `${channelId}ChannelContents`);

        if (!isUserMessage)
            return socket.emit('emitChannelDeleteMessageError', Response.HTTP_FORBIDDEN);

        this.handleUserJoinState(socket, channelId, 'channel');

        this.emitToSpecificSocket(channelId, 'emitChannelDeleteMessage', Response.HTTP_OK);

        await this.removeMessage(`${channelId}ChannelContents`, listOfId);
    }


}
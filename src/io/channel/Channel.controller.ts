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

    @SubscribeMessage("onChannelSendMessage")
    async sendMessageInChannel(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let channelId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId, senderId),
            this.isOwnerOrAdmin(channelId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitChannelSendMessageError', haveErr);

        delete data.roomId;
        data.messageCreatedBySenderId = senderId;
        data.messageSentRoomId = `${channelId}ChannelContents`;

        let message = await this.handleMessage(data);

        if (message?.statusCode)
            return socket.emit('emitChannelSendMessageError', message);

        await this.handleUserJoinState(socket, channelId, 'channel');

        this.emitToSpecificSocket(channelId, 'emitChannelSendMessage', message);

        await this.saveMessage({
            tableName: data.messageSentRoomId,
            message: message
        });
    }

    @SubscribeMessage("onChannelEditMessage")
    async updateMessageInChannel(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let messageId = data?.messageId,
            channelId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(messageId),
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId, senderId),
            this.isOwnerOrAdmin(channelId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitChannelEditMessageError', haveErr);

        await this.handleUserJoinState(socket, channelId, 'channel');

        let isUserMessage = this.isUserMessage(senderId, messageId, `${channelId}ChannelContents`);

        if (!isUserMessage)
            return socket.emit('emitChannelEditMessageError', Response.HTTP_FORBIDDEN);

        delete data.roomId;
        delete data.messageId;
        delete data?.messageCreatedBySenderId;
        delete data?.messageSentRoomId;

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
            senderId = await this.getUserId(socket.id);

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

        await this.handleUserJoinState(socket, channelId, 'channel');

        this.emitToSpecificSocket(channelId, 'emitChannelDeleteMessage', Response.HTTP_OK);

        await this.deleteOldFiles('channel', channelId, listOfId);
        await this.removeMessage(`${channelId}ChannelContents`, listOfId);
    }

    @SubscribeMessage("onChannelSpecificMessage")
    async getSpecificItem(@MessageBody() data: JsonObject, @ConnectedSocket() socket: Socket) {
        let insertedId = data?.insertedId,
            channelId = data?.roomId,
            senderId = await this.getUserId(socket.id);

        let haveErr = await PromiseVerify.all([
            this.isUndefined(insertedId),
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId, senderId)
        ]);

        if (haveErr)
            return socket.emit('emitChannelSpecificMessageError', haveErr);

        this.emitToSpecificSocket(channelId, 'emitChannelSpecificMessage',
            await this.getMessageInRoom('channel', insertedId, channelId));
    }

}
import {Controller} from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import {SocketGatewayController} from "../base/SocketGateway.controller";
import {Socket} from "socket.io";
import {CommonService} from "./Common.service";
import {Activities} from "../../util/Types";
import Response from "../../util/Response";

@WebSocketGateway(Number(process.env.SOCKET_IO_PORT), {
    namespace: '/common',
    cors: true
})
@Controller()
export class CommonController extends SocketGatewayController {

    private readonly appService: CommonService = new CommonService();

    @SubscribeMessage("onUserActivities")
    async userActivities(@MessageBody() activity: Activities, @ConnectedSocket() socket: Socket) {
        let userId = this.getUserId(socket.id),
            typeChats = ['group', 'channel', 'e2e', 'all'],
            isValidType = typeChats.includes(activity.type);

        if (!isValidType)
            return socket.emit('emitUserActivitiesError', Response.HTTP_BAD_REQUEST);

        if (activity.type === 'all')
            return socket.emit('emitUserActivities', await this.appService.getAllActivity(userId));

        return socket.emit('emitUserActivities', await this.appService.listOfUserActivity(userId, activity.type));
    }

}
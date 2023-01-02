import {Controller} from '@nestjs/common';
import {
    WebSocketGateway,
} from "@nestjs/websockets";
import {SocketGatewayController} from "../base/SocketGateway.controller";

@WebSocketGateway(Number(process.env.SOCKET_IO_PORT),{
    namespace: '/channel'
})
@Controller()
export class ChannelController extends SocketGatewayController {



}
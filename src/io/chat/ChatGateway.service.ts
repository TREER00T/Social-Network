import * as dotenv from "dotenv";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

dotenv.config();

@WebSocketGateway(Number(process.env.SOCKET_IO_PORT))
export class ChatGatewayService {

  @WebSocketServer()
  io: Server;

  @SubscribeMessage("message")
  ali(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    this.io.emit("message", { ali: 1552 });
    console.log(message);
  }

}
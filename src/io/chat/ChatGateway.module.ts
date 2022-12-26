import { Module } from "@nestjs/common";
import { ChatGatewayController } from "./ChatGateway.controller";
import { ChatGatewayService } from "./ChatGateway.service";

@Module({
  controllers: [ChatGatewayController],
  providers: [ChatGatewayService]
})

export class ChatGatewayModule {
}

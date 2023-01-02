import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";

let Update = require("../../model/update/user"),
    Find = require("../../model/find/user"),
    Redis = require("../../database/redisDbDriver");


@Injectable()
export class SocketGatewayService {

    async updateUserStatus(userPhone: string, status: number) {
        await Update.userOnline(userPhone, status);
    }

    private async getUsersFromListOfUser(userId: string): Promise<string[]> {
        return await Find.getUsersFromListOfUser(userId);
    }

    async sendUserOnlineStatusForSpecificUsers(io: Server, status: boolean, userId: string) {

        let users = await this.getUsersFromListOfUser(userId);

        for (const u of users) {
            let user = await Redis.get(u);

            if (user)
                io.to(user.socketId).emit('onlineStatus', {
                    userId: user.id,
                    isOnline: status
                });

        }

    }

}

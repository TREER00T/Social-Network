import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";
import Find from "../../model/find/user";

let Update = require("../../model/update/user"),
    Redis = require("../../database/redisDbDriver");


@Injectable()
export class SocketGatewayService {

    async updateUserStatus(userPhone: string, status: number) {
        await Update.userOnline(userPhone, status);
    }

    async sendUserOnlineStatusForSpecificUsers(io: Server, status: boolean, userId: string) {

        let users = await Find.getUsersFromListOfUser(userId);

        for (const u of users) {
            let user = await Redis.get(u);

            if (user)
                io.to(user.socketId).emit('onlineStatus', {
                    userId: user.id,
                    isOnline: status
                });

        }

    }

    async isExistChat(receiverId: string, socketUserId: string): Promise<boolean> {
        return await Find.isExistChatRoom({
            toUser: receiverId,
            fromUser: socketUserId
        });
    }

}

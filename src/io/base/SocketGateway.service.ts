import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";
import Find from "../../model/find/user";

let Redis = require("../../database/redisDbDriver");
let Update = require("../../model/update/user");


@Injectable()
export class SocketGatewayService {

    async sendListOfUserOnlineStatusForSpecificUser(io: Server, userId: string, status: boolean) {

        let users = await Find.getUsersFromListOfUser(userId);

        await this.notifyingOtherUsersForUserConnection(io, userId, users, status);

        for (const u of users) {
            let user = await Redis.get(u);

            if (user)
                users = {userId: user.id, socketId: user.socketId};
        }

        let user = await Redis.get(userId);

        io.to(user.socketId).emit('emitListOfUserOnlineStatusForSpecificUser', userId);

    }

    async notifyingOtherUsersForUserConnection(io: Server, userId: string, listOfUser: string[], status: boolean) {

        for (const u of listOfUser) {
            let user = await Redis.get(u);

            if (user)
                io.to(user.socketId).emit('emitNotifyListOfUserOnlineStatus', {
                    userId: userId,
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

    async updateUserStatus(userId, status: boolean) {
        await Update.updateUserStatus(userId, status);
    }

}

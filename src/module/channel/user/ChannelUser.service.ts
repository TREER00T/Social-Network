import {Injectable} from '@nestjs/common';
import {UserId} from "../../base/dto/User";

let Insert = require("../../../model/add/channel"),
    Delete = require("../../../model/remove/channel"),
    DeleteInUser = require("../../../model/remove/user"),
    FindInUser = require("../../../model/find/user"),
    Find = require("../../../model/find/channel"),
    InsertInUser = require("../../../model/add/user");

@Injectable()
export class ChannelUserService {
    async listOfUserWithDetails(users: UserId[]) {
        return await FindInUser.getUserDetailsInUsersTableForMember(users);
    }

    async listOfUser(channelId: string) {
        return await Find.getAllUsers(channelId);
    }

    async joinUser(channelId: string, userId: string) {
        await Insert.user(userId, channelId);
        await InsertInUser.channelIntoListOfUserChannels(channelId, userId);
    }

    async leaveUser(channelId: string, userId: string) {
        await Delete.user(userId, channelId);
        await DeleteInUser.userFromChannel(channelId, userId);
    }
}

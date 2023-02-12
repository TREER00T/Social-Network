import {Injectable} from '@nestjs/common';
import Insert from "../../../model/add/channel";
import DeleteInUser from "../../../model/remove/user";
import FindInUser from "../../../model/find/user";
import Find from "../../../model/find/channel";
import InsertInUser from "../../../model/add/user";
import {UserId} from "../../../util/Types";

let Delete = require("../../../model/remove/channel");

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
        await Delete.user(channelId, userId);
        await DeleteInUser.userFromChannel(channelId, userId);
    }
}

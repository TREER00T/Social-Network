import {Injectable} from '@nestjs/common';
import {UserId} from "../../base/dto/User";

let Insert = require("../../../model/add/group"),
    Delete = require("../../../model/remove/group"),
    DeleteInUser = require("../../../model/remove/user"),
    FindInUser = require("../../../model/find/user"),
    Find = require("../../../model/find/group"),
    InsertInUser = require("../../../model/add/user");

@Injectable()
export class GroupUserService {
    async listOfUserWithDetails(users: UserId[]) {
        return await FindInUser.getUserDetailsInUsersTableForMember(users);
    }

    async listOfUser(groupId: string) {
        return await Find.getAllUsers(groupId);
    }

    async joinUser(groupId: string, userId: string) {
        await Insert.user(userId, groupId);
        await InsertInUser.groupIntoListOfUserGroup(groupId, userId);
    }

    async leaveUser(groupId: string, userId: string) {
        await Delete.user(userId, groupId);
        await DeleteInUser.userFromGroup(groupId, userId);
    }
}

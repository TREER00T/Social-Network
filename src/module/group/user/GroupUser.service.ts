import {Injectable} from '@nestjs/common';
import {UserId} from "../../base/dto/User";
import Insert from "../../../model/add/group";
import DeleteInUser from "../../../model/remove/user";
import FindInUser from "../../../model/find/user";
import Find from "../../../model/find/group";
import InsertInUser from "../../../model/add/user";

let Delete = require("../../../model/remove/group");

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

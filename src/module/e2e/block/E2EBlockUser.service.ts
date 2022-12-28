import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user"),
    Insert = require("../../../model/add/user"),
    Delete = require("../../../model/remove/user");

@Injectable()
export class E2EBlockUserService {
    async enableBlockUser(userIdWhichCreatedChat: string, targetUserId: string) {
        await Insert.addUserToUsersBlockList(userIdWhichCreatedChat, targetUserId);
    }

    async disableBlockUser(userIdWhichCreatedChat: string, targetUserId: string) {
        await Delete.userInUsersBlockList(userIdWhichCreatedChat, targetUserId);
    }

    async isExistUser(userId: string) {
        return await Find.isExist(userId);
    }

    async hasUserBlocked(userIdWhichCreatedChat: string, targetUserId: string) {
        return await Find.isBlock(userIdWhichCreatedChat, targetUserId);
    }
}

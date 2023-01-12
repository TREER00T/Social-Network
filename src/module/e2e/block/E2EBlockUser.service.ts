import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";
import Insert from "../../../model/add/user";
import Delete from "../../../model/remove/user";

@Injectable()
export class E2EBlockUserService {
    async enableBlockUser(userIdWhichCreatedChat: string, targetUserId: string) {
        await Insert.addUserToUsersBlockList(userIdWhichCreatedChat, targetUserId);
    }

    async disableBlockUser(userIdWhichCreatedChat: string, targetUserId: string) {
        await Delete.userInUsersBlockList(userIdWhichCreatedChat, targetUserId);
    }

    async hasUserBlocked(userIdWhichCreatedChat: string, targetUserId: string) {
        return await Find.isBlock(userIdWhichCreatedChat, targetUserId);
    }
}

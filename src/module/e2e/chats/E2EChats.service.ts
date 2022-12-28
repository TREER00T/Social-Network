import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user");

@Injectable()
export class E2EChatsService {
    async getTableNameFrom2EChat(userIdWhichCreatedChat, targetUserId) {
        return await Find.getTableNameForListOfE2EMessage(userIdWhichCreatedChat, targetUserId, userIdWhichCreatedChat);
    }
}

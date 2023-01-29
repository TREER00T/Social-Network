import {Injectable} from '@nestjs/common';
import Delete from "../../../model/remove/user";

@Injectable()
export class E2EDeleteChatService {
    async deleteChatForUs(nameOfE2ERoom: string, from: string, to: string) {
        await Delete.chat(nameOfE2ERoom);
        await Delete.chatInListOfE2EChat(from, to, from);
        await Delete.chatInListOfE2EChat(to, from, to);
    }

    async deleteChatForMe(from: string, to: string) {
        await Delete.chatInListOfE2EChat(from, to, from);
    }
}

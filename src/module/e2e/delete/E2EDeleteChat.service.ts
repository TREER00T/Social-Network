import {Injectable} from '@nestjs/common';
import Delete from "../../../model/remove/user";

@Injectable()
export class E2EDeleteChatService {
    async deleteChatForUs(nameOfE2ERoom: string, from: string, to: string) {
        await Delete.chat(nameOfE2ERoom);
        await Delete.chatInListOfE2EChat(from, to, to);
        await Delete.chatInListOfE2EChat(from, to, from);
    }

    async deleteChatForMe(from: string, to: string) {
        await Delete.chatInListOfE2EChat(from, to, from);
    }
}

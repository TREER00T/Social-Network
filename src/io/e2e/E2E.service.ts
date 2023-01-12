import {Injectable} from "@nestjs/common";
import Find from "../../model/find/user";

@Injectable()
export class E2EService {

    async isBlocked(senderId: string, receiverId: string) {
        return await Find.isBlock(senderId, receiverId);
    }

}

import {Injectable} from "@nestjs/common";

let Find = require("../../model/find/user");

@Injectable()
export class E2EService {

    async isBlocked(senderId: string, receiverId: string) {
        return await Find.isBlock(senderId, receiverId);
    }

}

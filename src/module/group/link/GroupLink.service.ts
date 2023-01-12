import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/group";

let Update = require("../../../model/update/group");

@Injectable()
export class GroupLinkService {
    async updateInviteLink(groupId: string, link: string) {
        await Update.inviteLink(groupId, link);
    }

    async updatePublicLink(groupId: string, link: string) {
        await Update.publicLink(groupId, link);
    }

    async hasExistPublicLink(link: string) {
        return await Find.isPublicKeyUsed(link);
    }
}

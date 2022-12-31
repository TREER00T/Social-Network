import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/group"),
    Find = require("../../../model/find/group");

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

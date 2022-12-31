import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/group");

@Injectable()
export class GroupNameService {
    async updateName(name: string, groupId: string) {
        await Update.name(groupId, name.toString().trim());
    }
}

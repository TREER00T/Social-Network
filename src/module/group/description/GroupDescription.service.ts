import {Injectable} from '@nestjs/common';

let Update = require("../../../model/update/group");

@Injectable()
export class GroupDescriptionService {
    async updateDescription(description: string, groupId: string) {
        await Update.description(groupId, description);
    }
}

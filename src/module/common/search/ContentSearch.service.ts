import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/common");

@Injectable()
export class ContentSearchService {
    async search(value) {
        return await Find.searchWithNameInTableUsersGroupsAndChannels(value);
    }
}

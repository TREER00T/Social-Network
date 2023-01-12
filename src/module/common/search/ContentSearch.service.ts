import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/common";

@Injectable()
export class ContentSearchService {
    async search(value) {
        return await Find.searchWithNameInTableUsersGroupsAndChannels(value);
    }
}

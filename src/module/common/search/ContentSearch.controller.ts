import {Controller, Get, Query} from '@nestjs/common';
import {ContentSearchService} from './ContentSearch.service';
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class ContentSearchController {
    constructor(private readonly appService: ContentSearchService) {
    }

    @Get()
    async search(@Query() v: string) {
        if (Util.isUndefined(v))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let result = await this.appService.search(v);

        if (Util.isUndefined(result))
            return Json.builder(Response.HTTP_NOT_FOUND);

        return Json.builder(Response.HTTP_OK, result);
    }
}

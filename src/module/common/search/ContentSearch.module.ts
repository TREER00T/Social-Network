import {Module} from "@nestjs/common";
import {ContentSearchController} from "./ContentSearch.controller";
import {ContentSearchService} from "./ContentSearch.service";

@Module({
    controllers: [ContentSearchController],
    providers: [ContentSearchService]
})
export class ContentSearchModule {
}

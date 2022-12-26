import { Module } from "@nestjs/common";
import { ContentSearchController } from "./ContentSearch.controller";
import { ContentSearchService } from "./ContentSearch.service";

@Module({
  imports: [],
  controllers: [ContentSearchController],
  providers: [ContentSearchService]
})
export class ContentSearchModule {
}

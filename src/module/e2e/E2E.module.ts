import {Module} from "@nestjs/common";
import {E2EController} from "./E2E.controller";
import {E2EService} from "./E2E.service";

@Module({
    controllers: [E2EController],
    providers: [E2EService]
})
export class E2EModule {
}

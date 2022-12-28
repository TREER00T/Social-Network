import {Module} from "@nestjs/common";
import {TwoStepController} from "./TwoStep.controller";
import {TwoStepService} from "./TwoStep.service";

@Module({
    controllers: [TwoStepController],
    providers: [TwoStepService]
})
export class TwoStepModule {
}

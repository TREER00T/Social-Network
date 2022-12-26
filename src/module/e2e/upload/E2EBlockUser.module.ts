import { Module } from "@nestjs/common";
import { E2EBlockUserController } from "./E2EBlockUser.controller";
import { E2EBlockUserService } from "./E2EBlockUser.service";

@Module({
  imports: [],
  controllers: [E2EBlockUserController],
  providers: [E2EBlockUserService]
})
export class E2EBlockUserModule {
}

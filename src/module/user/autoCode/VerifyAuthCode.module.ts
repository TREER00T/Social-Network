import { Module } from "@nestjs/common";
import { VerifyAuthCodeController } from "./VerifyAuthCode.controller";
import { VerifyAuthCodeService } from "./VerifyAuthCode.service";

@Module({
  imports: [],
  controllers: [VerifyAuthCodeController],
  providers: [VerifyAuthCodeService]
})
export class VerifyAuthCodeModule {
}
import { Module } from "@nestjs/common";
import { RefreshTokenController } from "./RefreshToken.controller";
import { RefreshTokenService } from "./RefreshToken.service";

@Module({
  imports: [],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService]
})
export class RefreshTokenModule {
}

import {IsInt, IsNotEmpty, IsString, Length} from "class-validator";
import { UserDeviceInfo } from "../../base/dto/UserDeviceInfo";

export class VerifyAuthCodeDto extends UserDeviceInfo {

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phone: string;

  @IsInt()
  @Length(6, 6)
  authCode: number;
}
import {IsInt, IsNotEmpty, IsPhoneNumber, IsString, Length} from "class-validator";
import { UserDeviceInfo } from "../../base/dto/UserDeviceInfo";

export class VerifyAuthCodeDto extends UserDeviceInfo {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(6, 16)
  phone: string;

  @IsInt()
  @Length(6, 6)
  authCode: number;
}
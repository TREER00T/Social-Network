import { IsIP, IsString } from "class-validator";

export class UserDeviceInfo {

  @IsIP()
  deviceIp: string;

  @IsString()
  deviceName: string;

  @IsString()
  deviceLocation: string;

}
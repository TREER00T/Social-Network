import {IsIP, IsNotEmpty, IsString} from "class-validator";

export class UserDeviceInfo {
    @IsIP()
    @IsNotEmpty()
    deviceIp: string;

    @IsString()
    @IsNotEmpty()
    deviceName: string;

    @IsString()
    @IsNotEmpty()
    deviceLocation: string;
}
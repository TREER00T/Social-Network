import {IsNotEmpty, IsString} from "class-validator";

export class UserDeviceInfo {
    @IsString()
    @IsNotEmpty()
    deviceLocation: string;
}
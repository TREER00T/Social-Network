import {IsNotEmpty, IsString, Min} from "class-validator";
import {UserDeviceInfo} from "../../base/dto/UserDeviceInfo";

export class TwoStepDto extends UserDeviceInfo {
    @IsString()
    @Min(6)
    @IsNotEmpty()
    password: string;
}
import {IsNotEmpty, IsString, Length} from "class-validator";
import {UserDeviceInfo} from "../../base/dto/UserDeviceInfo";

export class TwoStepDto extends UserDeviceInfo {

    @IsString()
    @Length(6)
    @IsNotEmpty()
    password: string;

}
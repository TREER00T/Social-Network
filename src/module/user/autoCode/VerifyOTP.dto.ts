import {IsInt, IsNotEmpty, IsPhoneNumber, IsString, Length, Max, Min} from "class-validator";
import {UserDeviceInfo} from "../../base/dto/UserDeviceInfo";
import {Type} from "class-transformer";

export class VerifyOTPDto extends UserDeviceInfo {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    @Length(6, 16)
    phone: string;

    @Type(() => Number)
    @IsInt()
    @Min(100000)
    @Max(999999)
    code: number;
}
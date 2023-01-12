import {IsNotEmpty, IsPhoneNumber, IsString, Length} from "class-validator";

export class GenerateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    @Length(6, 16)
    phone: string;
}
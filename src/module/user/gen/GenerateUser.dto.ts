import {IsNotEmpty, IsString, Length} from "class-validator";

export class GenerateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(10, 20)
    phone: string;
}
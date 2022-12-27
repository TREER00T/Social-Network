import {IsNotEmpty, IsString, Length} from "class-validator";

export class AuthPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Length(6)
    old: string;

    @IsString()
    @IsNotEmpty()
    @Length(6)
    new: string;
}
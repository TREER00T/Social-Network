import {IsNotEmpty, IsString, Min} from "class-validator";

export class AuthPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Min(6)
    old: string;

    @IsString()
    @IsNotEmpty()
    @Min(6)
    new: string;
}
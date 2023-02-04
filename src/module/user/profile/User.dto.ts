import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @Length(3)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName: string;
}
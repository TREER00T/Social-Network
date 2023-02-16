import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class UserJoinDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1)
    userId?: string;
}
import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class UserIdDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1)
    userId?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1)
    username?: string;
}
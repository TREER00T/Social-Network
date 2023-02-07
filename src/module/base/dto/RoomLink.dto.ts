import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class RoomLinkDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    inviteLink?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicLink?: string;
}
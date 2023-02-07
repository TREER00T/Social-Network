import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {RoomLinkDto} from "./RoomLink.dto";

export class GroupLinkDto extends RoomLinkDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    groupId?: string;
}
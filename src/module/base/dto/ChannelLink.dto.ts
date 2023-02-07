import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {RoomLinkDto} from "./RoomLink.dto";

export class ChannelLinkDto extends RoomLinkDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    channelId?: string;
}
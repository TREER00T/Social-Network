import {Message} from "./Message";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class RoomMessage extends Message {
    @IsString()
    @IsNotEmpty()
    senderId: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    roomId?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    receiverId?: string;
}
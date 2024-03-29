import {Message} from "./Message";
import {IsNotEmpty, IsString, Length} from "class-validator";

export class RoomMessage extends Message {
    @IsString()
    @IsNotEmpty()
    @Length(1)
    roomId: string;
}
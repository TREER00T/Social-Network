import {Message} from "./Message";
import {IsNotEmpty, IsString} from "class-validator";

export class TE2EMessage extends Message {
    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @IsString()
    @IsNotEmpty()
    roomId: string;
}
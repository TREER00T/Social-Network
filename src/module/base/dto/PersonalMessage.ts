import {Message} from "./Message";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class PersonalMessage extends Message {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    senderId?: string;
}
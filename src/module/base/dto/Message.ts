import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class Message {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    text?: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    isReply?: boolean;

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    isForward?: boolean;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    targetReplyId?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    forwardDataId?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    locationLat?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    locationLon?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    messageId?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    messageCreatedBySenderId?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    messageSentRoomId?: string;
}
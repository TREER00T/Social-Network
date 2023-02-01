import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class Message {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    text?: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsBoolean()
    @IsOptional()
    isReply?: boolean;

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
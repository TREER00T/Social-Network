import {IsNotEmpty, IsString, Length} from "class-validator";
import {UserJoinDto} from "../../base/dto/UserJoin.dto";

export class ChannelUserDto extends UserJoinDto {
    @IsString()
    @IsNotEmpty()
    @Length(1)
    channelId: string;
}
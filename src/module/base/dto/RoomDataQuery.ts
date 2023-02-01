import {IsNotEmpty, IsString, Length} from "class-validator";
import {DataQuery} from "./DataQuery";

export class RoomDataQuery extends DataQuery {
    @IsString()
    @IsNotEmpty()
    @Length(1)
    roomId: string;
}
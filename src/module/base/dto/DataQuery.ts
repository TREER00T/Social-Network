import {IsInt, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";
import {Type} from "class-transformer";

export class DataQuery {
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    limit?: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    page?: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    order?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    type?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    sort?: string;

    @IsString()
    @IsNotEmpty()
    @Length(1)
    @IsOptional()
    search?: string;
}
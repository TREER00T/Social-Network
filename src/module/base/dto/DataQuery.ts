import {IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length} from "class-validator";

export class DataQuery {
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
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
import {IsNotEmpty, IsString, Length} from "class-validator";

export class PersonalNameDto {
    @IsString()
    @IsNotEmpty()
    @Length(3)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName?: string;
}
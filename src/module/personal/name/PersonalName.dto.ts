import {IsNotEmpty, IsString} from "class-validator";

export class PersonalNameDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}
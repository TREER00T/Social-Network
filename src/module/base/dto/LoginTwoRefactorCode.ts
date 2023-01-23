import {IsEmail, IsNotEmpty, IsString, Min} from "class-validator";

export class LoginTwoRefactorCode {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @Min(6)
    password: string;
}
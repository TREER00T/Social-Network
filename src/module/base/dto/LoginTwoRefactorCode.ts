import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class LoginTwoRefactorCode {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(6)
    password: string;
}
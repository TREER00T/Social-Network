import { IsString, Length } from "class-validator";

export class GenerateUserDto {
  @IsString()
  @Length(10, 20)
  phone: string;
}
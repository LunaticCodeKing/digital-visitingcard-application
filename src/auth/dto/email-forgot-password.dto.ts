import { IsEmail } from "class-validator";

export class EmailForgotPasswordDTO {
    @IsEmail()
    email : string;
}
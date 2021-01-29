import { IsNotEmpty } from "class-validator";

export class EmailResetPasswordDTO {
    
    @IsNotEmpty()
    reset_token : string;

    @IsNotEmpty()
    password: string;
}
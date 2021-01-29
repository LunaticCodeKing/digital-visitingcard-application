import { IsNotEmpty } from "class-validator";

export class EmailLoginDTO {
    
    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    password: string;
}
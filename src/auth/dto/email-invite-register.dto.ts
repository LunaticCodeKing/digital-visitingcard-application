import { IsNotEmpty, IsOptional } from "class-validator";

export class EmailInviteRegisterDTO {
    @IsNotEmpty()
    invite_token : string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsOptional()
    mobile_number: string;

    @IsOptional()
    timezone: string;

    @IsNotEmpty()
    password: string;
}
import { IsOptional, IsEmail, IsNotEmpty, ArrayNotEmpty, IsArray} from 'class-validator';

export class UpdateUserDTO {
    @IsOptional()
    @IsNotEmpty()
    firstname: string;

    @IsOptional()
    @IsNotEmpty()
    lastname: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    mobile_number: string;
    
    @IsOptional()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsNotEmpty()
    timezone: string;
}
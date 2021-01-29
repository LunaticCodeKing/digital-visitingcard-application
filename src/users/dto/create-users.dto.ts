import { IsEmail, IsNotEmpty, ArrayNotEmpty, IsArray, IsOptional} from 'class-validator';

export class CreateUserDTO {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    email: string;

    @IsOptional()
    mobile_number: string;
    
    @IsNotEmpty()
    password: string;

    @IsOptional()
    timezone: string;
}
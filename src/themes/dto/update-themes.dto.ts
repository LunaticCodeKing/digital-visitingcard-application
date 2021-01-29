import { IsOptional, IsEmail, IsNotEmpty, ArrayNotEmpty, IsArray} from 'class-validator';

export class UpdateThemeDTO {
    @IsOptional()
    @IsNotEmpty()
    name: string;
}


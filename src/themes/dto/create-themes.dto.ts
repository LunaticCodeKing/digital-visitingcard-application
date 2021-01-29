import { IsEmail, IsNotEmpty, ArrayNotEmpty, IsArray, IsOptional} from 'class-validator';

export class CreateThemeDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    sequence: number;

    @IsNotEmpty()
    key: string;
}
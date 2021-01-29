import { IsNotEmpty, ArrayNotEmpty, IsArray} from 'class-validator';

export class CreateRoleDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
    
    @IsArray()
    @ArrayNotEmpty()
    permissions: string[];
}
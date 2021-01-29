import { IsNotEmpty, ArrayNotEmpty, IsArray, IsOptional} from 'class-validator';

export class UpdateRoleDTO {

    @IsOptional()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    description: string;
    
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    permissions: string[];
}
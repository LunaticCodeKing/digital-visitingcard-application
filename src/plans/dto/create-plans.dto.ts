import { IsEmail, IsNotEmpty, ArrayNotEmpty, IsArray, IsOptional} from 'class-validator';

export class CreatePlanDTO {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    short_desc: string;

    @IsNotEmpty()
    base_price: number;

    @IsOptional()
    price: number;

    @IsOptional()
    discount_price: number;

    @IsOptional()
    discount_type: string;

    @IsOptional()
    discount_value: string;
    
    @IsNotEmpty()
    plan_period: object;

    @IsNotEmpty()
    features: object[];

    @IsOptional()
    timezone: string;
}
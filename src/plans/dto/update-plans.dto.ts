import { IsOptional, IsEmail, IsNotEmpty, ArrayNotEmpty, IsArray} from 'class-validator';

export class UpdatePlanDTO {
    @IsOptional()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    short_desc: string;

    @IsOptional()
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

    @IsOptional()
    @IsNotEmpty()
    plan_period: object;

    @IsOptional()
    @IsNotEmpty()
    features: object[];

    @IsOptional()
    timezone: string;
}


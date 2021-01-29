import { Document, Types} from 'mongoose';

export interface IPlan extends Document{
    name: string,
    short_desc: string,
    base_price: number,
    discount_price: number,
    discount_type: string,
    discount_value: number,
    price: number,
    plan_period: {
        title: string,
        plan_type: string,
        value: number,
    },
    features: Array<object>,
    timezone: string,
    is_active: boolean,
}
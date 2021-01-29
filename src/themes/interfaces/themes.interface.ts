import { Document, Types} from 'mongoose';

export interface ITheme extends Document{
    name: string,
    sequence: number,
    discount_price: number,
    key: string,
    is_active: boolean,
}
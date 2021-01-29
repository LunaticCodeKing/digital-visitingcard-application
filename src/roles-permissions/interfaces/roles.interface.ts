import { Document } from 'mongoose';

export interface IRole extends Document{
    name: string,
    description: string,
    is_primary_role: boolean,
    permissions: string[]
}
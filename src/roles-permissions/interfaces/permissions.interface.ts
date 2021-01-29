import { Document } from 'mongoose';

export interface IPermission extends Document{
    module: string,
    action: string,
    value: string
}
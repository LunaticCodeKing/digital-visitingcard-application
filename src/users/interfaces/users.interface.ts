import { Document, Types} from 'mongoose';

interface IUserToken {
    token : string,
    timestamp: Date,
    expired: boolean
}

export interface IUser extends Document{
    firstname: string,
    lastname: string,
    email: string,
    mobile_number: string
    password: string,
    roles: string[],
    timezone: string,
    reset_password: IUserToken,
    email_invitation: IUserToken,
    is_super_admin: boolean,
    is_blocked: boolean,
    is_verified: boolean,
}
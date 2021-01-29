import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/users.interface'
import { CreateUserDTO } from './dto/create-users.dto';
import parsePhoneNumber from 'libphonenumber-js/mobile'
import { generateRandomToken } from 'src/common/utils/random-token-generator.util'
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UsersService {
    constructor(@InjectModel('Users') private usersModel: Model<IUser>,
    private configService: ConfigService) {}

    private readonly logger = new Logger('Users')

    async create(CreateUserDTO: CreateUserDTO): Promise<IUser> {
        if(CreateUserDTO.mobile_number){
            const phoneNumber = parsePhoneNumber(CreateUserDTO.mobile_number)
            if(!phoneNumber || phoneNumber.isValid() === false){
                throw new BadRequestException("Mobile Number Not Valid");
            }
        }
        const createdUser = new this.usersModel(CreateUserDTO);
        return createdUser.save();
    }

    async sendEmailInvitation(id: string): Promise<any>{
        
        const filterQuery = {
            _id: id,
            is_deleted: false
        }

        const updateQuery = {
            "email_invitation.token" : generateRandomToken(),
            "email_invitation.timestamp": Date.now(),
            "email_invitation.expired": false
        }

        const updated_user = await this.updateOne(filterQuery, updateQuery)

        if(!updated_user){
            throw new BadRequestException("Invitation Token Updation Failed");
        }

        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<string>('SMTP_PORT'),
            secure: this.configService.get<string>('SMTP_SECURE'), // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('SMTP_USERNAME'),
                pass: this.configService.get<string>('SMTP_PASSWORD')
            }
        });

        const invite_link = `${this.configService.get<string>('ADMIN_FRONTEND_URL')}/auth/email/register/${updated_user.email_invitation.token}` 
    
        const mailOptions = {
          from: this.configService.get<string>('DEFAULT_MAIL_FROM'), 
          to: updated_user.email,
          subject: `You've been invited to access a Digicard wala account`, 
          html: `Hi ${updated_user.firstname.charAt(0).toUpperCase()+updated_user.firstname.slice(1)}! <br>
          <p>You are invited to access the following Digicard wala account.</p>
          <p>Please click below to register.</p>
          <a target="_blank" href=${invite_link}><button style="background:#4C78DC;color:white;width:250px;height:50px;padding:5px;font-size:20px;border:0px;border-radius:4px;outline:none;cursor:pointer">Click to Register</button></a><br>
          <p>If you're unable to click the link above or you encounter any issues, please copy and paste this URL into a new browsing window instead:<p>
          <p>Invite Link : ${invite_link}</p><br>
          <p>Welcome,</p>
          <p>Digicard wala Team</p>`  // html body
        };

        let email_sent = false
    
        try{
            await transporter.sendMail(mailOptions)
            email_sent = true
        }
        catch(error){
            this.logger.error('MAIL_ERROR', error.message)
            email_sent= false
        }

        return {invite_link: invite_link, email_sent: email_sent}

    }

    async findOne(filterQuery:any = {}): Promise<IUser> {
        return this.usersModel.findOne(filterQuery).exec();
    }

    async countAll(filterQuery:any = {}): Promise<number> {
        return this.usersModel.countDocuments(filterQuery).exec();
    }

    async findAll(filterQuery:any = {}, skip, limit): Promise<IUser[]> {
        return this.usersModel.find(filterQuery).skip(parseInt(skip)).limit(parseInt(limit)).exec();
    }

    async updateOne(filterQuery:any = {}, updateQuery): Promise<IUser> {
        if(updateQuery.mobile_number){
            const phoneNumber = parsePhoneNumber(updateQuery.mobile_number)
            if(!phoneNumber || phoneNumber.isValid() === false){
                throw new BadRequestException("Mobile Number Not Valid");
            }
        }
        return this.usersModel.findOneAndUpdate(filterQuery, updateQuery, { new : true, useFindAndModify: false}).exec();
    }

    async updateMany(filterQuery, updateQuery): Promise<any> {
        return this.usersModel.updateMany(filterQuery, {$set: updateQuery}).exec();
    }

    async deleteOne(id): Promise<any> {
        return this.usersModel.updateOne({_id: id, is_deleted: false}, { $set: { is_deleted: true }}).exec()
    }

    async deleteMany(ids): Promise<any> {
        return this.usersModel.updateMany({_id: { $in : ids }, is_deleted: false}, { $set: { is_deleted: true }}).exec()
    }
}

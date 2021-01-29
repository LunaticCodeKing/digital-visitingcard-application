import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BcryptConstants, MessageConstants } from 'src/common/constants';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { EmailInviteRegisterDTO } from './dto/email-invite-register.dto';
import { EmailLoginDTO } from './dto/email-login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailForgotPasswordDTO } from './dto/email-forgot-password.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { generateRandomToken } from 'src/common/utils/random-token-generator.util';
import { EmailResetPasswordDTO } from './dto/email-reset-password.dto';
import parsePhoneNumber from 'libphonenumber-js/mobile'

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, 
        private readonly jwtService: JwtService,
        private configService: ConfigService) {}

    private readonly logger = new Logger('Auth')

    async emailLogin(emailLoginDTO: EmailLoginDTO){
        const filterQuery = {
            email: emailLoginDTO.email,
            is_deleted: false
        }
        let user = await this.usersService.findOne(filterQuery)

        if (!user) throw new NotFoundException(MessageConstants.USER_NOT_FOUND);

        if(user.is_blocked) throw new ForbiddenException(MessageConstants.USER_BLOCKED);

        await this.verifyPassword(emailLoginDTO.password, user.password);
        
        user = await (user).toJSON();
        delete user.reset_password
        delete user.email_invitation
        delete user.password

        const access_token = await this.jwtService.sign({id: user._id, timezone: user.timezone})
        return { access_token, user }
    }

    private async verifyPassword(plainPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
          plainPassword,
          hashedPassword
        );
        if (!isPasswordMatching) {
          throw new BadRequestException(MessageConstants.INVALID_CREDENTIALS);
        }
    }

    async emailRegisterInfo(invite_token: string){
        const filterQuery = {
            "email_invitation.token": invite_token,
            "email_invitation.expired": false,
            is_deleted: false
        }
        const user = await this.usersService.findOne(filterQuery);
        
        if (!user) throw new NotFoundException(MessageConstants.INVALID_INVITE);

        if(user.is_blocked) throw new ForbiddenException(MessageConstants.USER_BLOCKED);

        return {email: user.email, firstname: user.firstname, lastname: user.lastname, mobile_number: user.mobile_number, timezone: user.timezone }
    }
    
    async emailRegister(emailInviteRegisterDTO: EmailInviteRegisterDTO){

        if(emailInviteRegisterDTO.mobile_number){
            const phoneNumber = parsePhoneNumber(emailInviteRegisterDTO.mobile_number)
            if(!phoneNumber || phoneNumber.isValid() === false){
                throw new BadRequestException(MessageConstants.INVALID_MOBILE);
            }
        }
        
        const filterQuery = {
            "email_invitation.token": emailInviteRegisterDTO.invite_token,
            "email_invitation.expired": false,
            is_deleted: false
        }
        const user = await this.usersService.findOne(filterQuery);
        
        if (!user) throw new NotFoundException(MessageConstants.INVALID_INVITE);

        if(user.is_blocked) throw new ForbiddenException(MessageConstants.USER_BLOCKED);

        const password_hash = await bcrypt.hash(emailInviteRegisterDTO.password, BcryptConstants.SALT_ROUNDS)

        const updateQuery = {
            "email_invitation.expired": true,
            firstname: emailInviteRegisterDTO.firstname,
            lastname: emailInviteRegisterDTO.lastname,
            password: password_hash,
            is_verified: true,
        }

        let updated_user = await this.usersService.updateOne(filterQuery,  updateQuery);

        if(!updated_user){
            throw new NotFoundException(MessageConstants.REGISTRATION_FAILED)
        }

        updated_user = await (updated_user).toJSON();
        delete updated_user.reset_password
        delete updated_user.email_invitation
        delete updated_user.password
        
        
        const access_token = await this.jwtService.sign({id: updated_user._id, timezone: updated_user.timezone})
        return { access_token, updated_user }
    }

    async emailForgotPassword(emailForgotPasswordDTO: EmailForgotPasswordDTO){
        const filterQuery = {
            email: emailForgotPasswordDTO.email,
            is_deleted: false
        }
        const user = await this.usersService.findOne(filterQuery);
        
        if (!user) throw new NotFoundException(MessageConstants.EMAIL_NOT_FOUND);

        if(user.is_blocked) throw new ForbiddenException(MessageConstants.USER_BLOCKED);

        const updateQuery = {
            "reset_password.token"     : generateRandomToken(),
            "reset_password.timestamp" : Date.now(),
            "reset_password.expired"   : false
        }

        const updated_user = await this.usersService.updateOne(filterQuery, updateQuery)

        if(!updated_user){
            throw new BadRequestException(MessageConstants.NOT_MODIFIED);
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

        const reset_link = `${this.configService.get<string>('ADMIN_FRONTEND_URL')}/auth/email/reset-password/${updated_user.reset_password.token}` 
        
        const mailOptions = {
          from: this.configService.get<string>('DEFAULT_MAIL_FROM'), 
          to: updated_user.email,
          subject: 'Digicard Wala Forgot Password Request', 
          html: `Hi ${updated_user.firstname.charAt(0).toUpperCase()+updated_user.firstname.slice(1)}! <br> 
          <p>We have received a request to reset your Digicard Wala password.<p>
          <p>Please click below to change your password.</p>
          <a target="_blank" href=${reset_link}><button style="background:#4C78DC;color:white;width:250px;height:50px;padding:5px;font-size:20px;border:0px;border-radius:4px;outline:none;cursor:pointer">Click to Reset Password</button></a><br>
          <p style="color:red;"><strong>Please note that this Link is valid for 24 hours and will expire after this period.</strong></p>
          <p>If you're unable to click the link above or you encounter any issues, please copy and paste this URL into a new browsing window instead:<p>
          <p>Reset Password Link : ${reset_link}</p><br>
          <p>Welcome,</p>
          <p>Digicard Wala Team</p>`  // html body
        };
    
        const email_data  = await transporter.sendMail(mailOptions)
        return email_data
    }

    async emailResetPassword(emailResetPasswordDTO: EmailResetPasswordDTO){

        const filterQuery = {
            "reset_password.token": emailResetPasswordDTO.reset_token,
            "reset_password.expired": false,
            is_deleted: false
        }
        const user = await this.usersService.findOne(filterQuery);
        
        if (!user) throw new NotFoundException('Reset Token Not Valid');

        if(user.is_blocked) throw new ForbiddenException('User Is Blocked');

        const password_hash = await bcrypt.hash(emailResetPasswordDTO.password, BcryptConstants.SALT_ROUNDS)

        const updateQuery = {
            "reset_password.expired": true,
            password: password_hash,
        }

        let updated_user = await this.usersService.updateOne(filterQuery,  updateQuery);

        if(!updated_user){
            throw new NotFoundException('Reset Password Failed')
        }

        return true
    }
}

import { BadRequestException, Body, Controller, Get, HttpStatus , Param, Post, Res } from '@nestjs/common';
import { EmailInviteRegisterDTO } from './dto/email-invite-register.dto';
import { AuthService } from './auth.service';
import { EmailLoginDTO } from './dto/email-login.dto';
import { EmailForgotPasswordDTO } from './dto/email-forgot-password.dto';
import { EmailResetPasswordDTO } from './dto/email-reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // Email Login User
    @Post('email/login')
    async emailLoginUser(@Res() res, @Body() emailLoginDTO: EmailLoginDTO) {
        try{
            const login_data = await this.authService.emailLogin(emailLoginDTO)
            return res.status(HttpStatus.OK).json({
                message: "Login Successful",
                data: login_data
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Email Get Registration Info
    @Get('email/register-info/:invite_token')
    async getRegisterInfo(@Res() res, @Param('invite_token') invite_token: string) {
        try{
            const register_info_data = await this.authService.emailRegisterInfo(invite_token)
            return res.status(HttpStatus.OK).json({
                message: "Register Info",
                data: register_info_data
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Email Register User
    @Post('email/register')
    async registerUser(@Res() res, @Body() emailInviteRegisterDTO: EmailInviteRegisterDTO) {
        try{
            const register_data = await this.authService.emailRegister(emailInviteRegisterDTO)
            return res.status(HttpStatus.OK).json({
                message: "Registration Successfull",
                data: register_data
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Email Forgot Password
    @Post('email/forgot-password')
    async emailForgotPassword(@Res() res, @Body() emailForgotPasswordDTO: EmailForgotPasswordDTO) {
        try{
            const email_data = await this.authService.emailForgotPassword(emailForgotPasswordDTO)
            return res.status(HttpStatus.OK).json({
                message: "Reset Password Email Sent",
                data: { email: email_data.accepted[0]}
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Email Reset Password
    @Post('email/reset-password')
    async emailRestPassword(@Res() res, @Body() emailResetPasswordDTO: EmailResetPasswordDTO) {
        try{
            const reset_password = await this.authService.emailResetPassword(emailResetPasswordDTO)
            return res.status(HttpStatus.OK).json({
                message: "Password Reset Was Successful",
                data: { reset_password }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }
}

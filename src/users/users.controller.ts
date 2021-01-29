import { BadRequestException, Body, ConflictException, Controller, Delete, ForbiddenException, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-users.dto'
import { UpdateUserDTO } from './dto/update-users.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationConstants, BcryptConstants } from 'src/common/constants';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController{
    constructor(private usersService: UsersService) {}

    // Create a User
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @Post('register')
    async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
        try{
            const emailSearchQuery = {
                email:createUserDTO.email,
                is_deleted: false
            }
            const user = await this.usersService.findOne(emailSearchQuery)
            
            if(user && user.email && user.email === createUserDTO.email){
                throw new ConflictException('Email Already Exists')
            }
            
            if(user && user.mobile_number && user.mobile_number === createUserDTO.mobile_number){
                throw new ConflictException('Mobile Number Already Exists')
            }
            
            const password_hash = await bcrypt.hash(createUserDTO.password, BcryptConstants.SALT_ROUNDS)
            createUserDTO.password = password_hash;
            const new_user = await this.usersService.create(createUserDTO);
            if(!new_user){
                throw new BadRequestException('New User Creation Failed')
            }
            
            // this.usersService.sendEmailInvitation(new_user._id)

            return res.status(HttpStatus.OK).json({
                message: "User Created Successfully",
                data: { user: new_user}
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Resend Invitation
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('resend-invite/:id')
    async resendInvitation(@Res() res, @Param('id') id: string) {
        try{
            const filterQuery = {
                _id: id,
                is_deleted: false
            }

            let user = await this.usersService.findOne(filterQuery)

            if (!user) throw new NotFoundException('User Not Found');

            if(user.is_blocked) throw new ForbiddenException('User Is Blocked');

            const invite_data = await this.usersService.sendEmailInvitation(id);
            return res.status(HttpStatus.OK).json({
                message: "Invitation Sent Successfully",
                data: invite_data
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Count All Users
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('count')
    async getUsersCount(@Res() res) {
        try{
            const filterQuery = {
                is_deleted: false
            }
            const count = await this.usersService.countAll(filterQuery);
            return res.status(HttpStatus.OK).json({
                message: "Users Count",
                data: { count }
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }
    
    // List All Users
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({name:'skip', required: false})
    @ApiQuery({name:'limit', required: false})
    @Get()
    async getAllUsers(@Res() res, @Query('skip') skip:number = 0, @Query('limit') limit:number = PaginationConstants.LIMIT) {
        try{
            const filterQuery = {
                is_deleted: false
            }
            const users = await this.usersService.findAll(filterQuery,skip, limit);
            const count = await this.usersService.countAll(filterQuery)
            return res.status(HttpStatus.OK).json({
                message: "List Of Users",
                data: { users, total_count: count }
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Get one User
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneUser(@Res() res, @Param('id') id: string) {
        try{
            const filterQuery = {
                _id : id,
                is_deleted: false
            }
            const user = await this.usersService.findOne(filterQuery);
            if (!user) throw new NotFoundException('User Does Not Exist');
            return res.status(HttpStatus.OK).json({
                message: "User Found",
                data: { user }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Update one User
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateOneUser(@Res() res, @Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO ) {
        try{
            const emailOrMobileSearchQuery = {
                "$or":[
                    {email: updateUserDTO.email},
                    {mobile_number: updateUserDTO.mobile_number}
                ],
                is_deleted: false
            }
            const user_doc = await this.usersService.findOne(emailOrMobileSearchQuery)
            if(user_doc && user_doc._id != id && user_doc.email && user_doc.email === updateUserDTO.email){
                throw new ConflictException('Email Already Exists')
            }

            if(user_doc && user_doc._id != id && user_doc.mobile_number && user_doc.mobile_number === updateUserDTO.mobile_number){
                throw new ConflictException('Mobile Number Already Exists')
            }

            const filterQuery = {
                _id : id,
                is_deleted: false
            }

            const updated_user = await this.usersService.updateOne(filterQuery,  updateUserDTO);
            if(!updated_user){
                throw new NotFoundException('User Update Failed')
            }
            return res.status(HttpStatus.OK).json({
                message: "User Updated Successfully",
                data: { user: updated_user }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Delete one User
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOneUser(@Res() res, @Param('id') id: string) {
        try{
            const deleted_user = await this.usersService.deleteOne(id);
            if(!deleted_user || deleted_user.nModified < 1){
                throw new NotFoundException('User Delete Failed')
            }
            return res.status(HttpStatus.OK).json({
                message: "User Deleted Successfully",
                data: { id }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }
}

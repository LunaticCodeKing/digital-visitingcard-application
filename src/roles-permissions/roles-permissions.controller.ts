import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-roles.dto'
import { UpdateRoleDTO } from './dto/update-roles.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationConstants } from 'src/common/constants';
import { PermissionsService } from './permissions.service';

@Controller('roles-permissions')
export class RolesPermissionsController {
    constructor(private rolesService: RolesService, private permissionsService: PermissionsService) {}
            
    // Create a Role
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('roles')
    async createRole(@Res() res, @Body() createRoleDTO: CreateRoleDTO) {
        try{
            const roleSearchQuery = {
                name:createRoleDTO.name,
                is_deleted: false
            }
            const role = await this.rolesService.findOne(roleSearchQuery)
            if(role){
                throw new ConflictException('Email Already Exists')
            }
            const new_role = await this.rolesService.create(createRoleDTO);
            if(!new_role){
                throw new NotFoundException('New Role Creation Failed')
            }
            return res.status(HttpStatus.OK).json({
                message: "Role Created Successfully",
                data: { role: new_role }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Count All Roles
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('roles/count')
    async getRolesCount(@Res() res) {
        try{
            const filterQuery = {
                is_deleted: false
            }
            const count = await this.rolesService.countAll(filterQuery);
            return res.status(HttpStatus.OK).json({
                message: "Roles Count",
                data: { count }
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }
    
    // List All Roles
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({name:'skip', required: false})
    @ApiQuery({name:'limit', required: false})
    @Get('roles')
    async getAllRoles(@Res() res, @Query('skip') skip:number = 0, @Query('limit') limit:number = PaginationConstants.LIMIT) {
        try{
            const filterQuery = {
                is_deleted: false
            }
            const roles = await this.rolesService.findAll(filterQuery, skip, limit);
            const count = await this.rolesService.countAll(filterQuery)
            return res.status(HttpStatus.OK).json({
                message: "List Of Roles",
                data: { roles, total_count: count }
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Get one Role
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('roles/:id')
    async getOneRole(@Res() res, @Param('id') id: string) {
        try{
            const filterQuery = {
                _id : id,
                is_deleted: false
            }
            const role = await this.rolesService.findOne(filterQuery);
            if (!role) throw new NotFoundException('Role Does Not Exist');
            return res.status(HttpStatus.OK).json({
                message: "Role Found",
                data: { role }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Update one Role
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('roles/:id')
    async updateOneRole(@Res() res, @Param('id') id: string, @Body() updateRoleDTO: UpdateRoleDTO ) {
        try{
            const roleSearchQuery = {
                name: updateRoleDTO.name,
                is_deleted: false
            }
            const role_doc = await this.rolesService.findOne(roleSearchQuery)
            if(role_doc && role_doc._id != id){
                throw new ConflictException('Role Name Already Exists')
            }

            const filterQuery = {
                _id : id,
                is_deleted: false
            }

            const updated_role = await this.rolesService.updateOne(filterQuery,  updateRoleDTO);
            if(!updated_role){
                throw new NotFoundException('Role Update Failed')
            }
            return res.status(HttpStatus.OK).json({
                message: "Role Updated Successfully",
                data: { role: updated_role }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // Delete one Role
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('roles/:id')
    async deleteOneRole(@Res() res, @Param('id') id: string) {
        try{
            const deleted_role = await this.rolesService.deleteOne(id);
            if(!deleted_role || deleted_role.nModified < 1){
                throw new NotFoundException('Role Delete Failed')
            }
            return res.status(HttpStatus.OK).json({
                message: "Role Deleted Successfully",
                data: { id }
            })
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

    // List All Permissions
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('permissions/all')
    async getAllPermissions(@Res() res) {
        try{
            const permissions = await this.permissionsService.findAll();
            return res.status(HttpStatus.OK).json({
                message: "List Of All Permissions",
                data: { permissions }
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }
}
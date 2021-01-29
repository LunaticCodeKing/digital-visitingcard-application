import { BadRequestException, Body, ConflictException, Controller, Delete, ForbiddenException, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDTO } from './dto/create-themes.dto'
import { UpdateThemeDTO } from './dto/update-themes.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationConstants, MessageConstants } from 'src/common/constants';

@Controller('themes')
export class ThemesController {
    constructor(private themesService: ThemesService) { }

    /** Create a Themems */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async createTheme(@Res() res, @Body() createThemeDTO: CreateThemeDTO) {
        try {
            const searcuQuery = {
                name: createThemeDTO.name,
                is_deleted: false
            }
            const theme = await this.themesService.findOne(searcuQuery)
            let sequence: number;
            if (theme.sequence)
                sequence = theme.sequence++;
            else
                sequence = 1;

            let key = `THEME-${Date.now()}-${sequence}`;
            createThemeDTO.sequence = sequence;
            createThemeDTO.key = key;
            if (theme && theme.name && theme.name === createThemeDTO.name) {
                throw new ConflictException(MessageConstants.THEME_EXISTS)
            }

            const theme_data = await this.themesService.create(createThemeDTO);
            if (!theme_data) {
                throw new BadRequestException(MessageConstants.CREATE_FAILED)
            }

            return res.status(201).json({
                message: MessageConstants.CREATE_SUCCESS,
                data: { theme: createThemeDTO }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Count All Themems
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('count')
    async getThememCount(@Res() res) {
        try {
            const filterQuery = {
                is_deleted: false
            }
            const count = await this.themesService.countAll(filterQuery);
            return res.status(HttpStatus.OK).json({
                message: "theme Count",
                data: { count }
            });
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // List All Themes
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'skip', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @Get()
    async getAllThemes(@Res() res, @Query('skip') skip: number = 0, @Query('limit') limit: number = PaginationConstants.LIMIT) {
        try {
            const filterQuery = {
                is_deleted: false
            }
            const themes = await this.themesService.findAll(filterQuery, skip, limit);
            const count = await this.themesService.countAll(filterQuery)
            if (!themes.length) throw new NotFoundException(MessageConstants.DATA_NOT_FOUND);
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.DATA_FOUND,
                data: { themes, total_count: count }
            });
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Get one Theme
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneTheme(@Res() res, @Param('id') id: string) {
        try {
            const filterQuery = {
                _id: id,
                is_deleted: false
            }
            const theme = await this.themesService.findOne(filterQuery);
            if (!theme) throw new NotFoundException(MessageConstants.DATA_NOT_FOUND);
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.DATA_FOUND,
                data: { theme }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Update one Theme
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateOneTheme(@Res() res, @Param('id') id: string, @Body() updateThemeDTO: UpdateThemeDTO) {
        try {
            const searcuQuery = {
                name: updateThemeDTO.name,
                is_deleted: false
            }

            const theme_doc = await this.themesService.findOne(searcuQuery)
            if (theme_doc && theme_doc._id != id && theme_doc.name && theme_doc.name === updateThemeDTO.name) {
                throw new ConflictException(MessageConstants.PLAN_EXISTS)
            }

            const filterQuery = {
                _id: id,
                is_deleted: false
            }

            const updated_theme = await this.themesService.updateOne(filterQuery, updateThemeDTO);
            if (!updated_theme) {
                throw new NotFoundException(MessageConstants.NOT_MODIFIED)
            }
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.UPDATE_SUCCESS,
                data: { user: updated_theme }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Delete one Theme
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOneTheme(@Res() res, @Param('id') id: string) {
        try {
            const deleted_theme = await this.themesService.deleteOne(id);
            if (!deleted_theme || deleted_theme.nModified < 1) {
                throw new NotFoundException(MessageConstants.NOT_MODIFIED)
            }
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.DELETED_SUCCESS,
                data: { id }
            });
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}


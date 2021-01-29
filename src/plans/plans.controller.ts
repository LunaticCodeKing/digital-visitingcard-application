import { BadRequestException, Body, ConflictException, Controller, Delete, Get,
     HttpStatus, NotFoundException, Param, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDTO } from './dto/create-plans.dto'
import { UpdatePlanDTO } from './dto/update-plans.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationConstants, BcryptConstants, MessageConstants } from 'src/common/constants';

@Controller('plans')
export class PlansController {
    constructor(private plansService: PlansService) { }

    /** Create a Plans */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async createTheme(@Res() res, @Body() createPlanDTO: CreatePlanDTO) {
        try {
            const searcuQuery = {
                name: createPlanDTO.name,
                is_deleted: false
            }
            const plan = await this.plansService.findOne(searcuQuery)

            if (plan && plan.name && plan.name === createPlanDTO.name) {
                throw new ConflictException(MessageConstants.PLAN_EXISTS)
            }
            let data: any = {};
            data.base_price = createPlanDTO.base_price;
            data.discount_type = createPlanDTO.discount_type;
            data.discount_value = createPlanDTO.discount_value;
            let discount: any = await this.plansService.discountCalc(data);
            createPlanDTO.price = discount.price;
            createPlanDTO.discount_price = discount.discount_price;

            const plan_data = await this.plansService.create(createPlanDTO);
            if (!plan_data) {
                throw new BadRequestException(MessageConstants.CREATE_FAILED)
            }

            return res.status(201).json({
                message: MessageConstants.CREATE_SUCCESS,
                data: { plan: createPlanDTO }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Count All Plans
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('count')
    async getPlansCount(@Res() res) {
        try {
            const filterQuery = {
                is_deleted: false
            }
            const count = await this.plansService.countAll(filterQuery);
            return res.status(HttpStatus.OK).json({
                message: "Plans Count",
                data: { count }
            });
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // List All Plans
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'skip', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @Get()
    async getAllPlans(@Res() res, @Query('skip') skip: number = 0, @Query('limit') limit: number = PaginationConstants.LIMIT) {
        try {
            const filterQuery = {
                is_deleted: false
            }
            const plans = await this.plansService.findAll(filterQuery, skip, limit);
            const count = await this.plansService.countAll(filterQuery)
            if (!plans.length) throw new NotFoundException(MessageConstants.DATA_NOT_FOUND);
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.DATA_FOUND,
                data: { plans, total_count: count }
            });
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Get one Plans
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOnePlan(@Res() res, @Param('id') id: string) {
        try {
            const filterQuery = {
                _id: id,
                is_deleted: false
            }
            const plan = await this.plansService.findOne(filterQuery);
            if (!plan) throw new NotFoundException(MessageConstants.DATA_NOT_FOUND);
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.DATA_FOUND,
                data: { plan }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Update one Plan
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateOnePlan(@Res() res, @Param('id') id: string, @Body() updatePlanDTO: UpdatePlanDTO) {
        try {
            const searcuQuery = {
                name: updatePlanDTO.name,
                is_deleted: false
            }

            const plan_doc = await this.plansService.findOne(searcuQuery)
            if (plan_doc && plan_doc._id != id && plan_doc.name && plan_doc.name === updatePlanDTO.name) {
                throw new ConflictException(MessageConstants.PLAN_EXISTS)
            }

            let data: any = {};
            if (updatePlanDTO.base_price) {
                if (!updatePlanDTO.discount_type) throw new BadRequestException(MessageConstants.REQ_DISC_TYPE);
                if (!updatePlanDTO.discount_type) throw new BadRequestException(MessageConstants.REQ_DISC_VALUE);

                data.base_price = updatePlanDTO.base_price;
                data.discount_type = updatePlanDTO.discount_type;
                data.discount_value = updatePlanDTO.discount_value;
                let discount: any = await this.plansService.discountCalc(data);
                updatePlanDTO.price = discount.price;
                updatePlanDTO.discount_price = discount.discount_price;
            }

            const filterQuery = {
                _id: id,
                is_deleted: false
            }

            const updated_plan = await this.plansService.updateOne(filterQuery, updatePlanDTO);
            if (!updated_plan) {
                throw new NotFoundException(MessageConstants.NOT_MODIFIED)
            }
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.UPDATE_SUCCESS,
                data: { plan: updated_plan }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // Delete one Plan
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOnePlan(@Res() res, @Param('id') id: string) {
        try {
            const deleted_plan = await this.plansService.deleteOne(id);
            if (!deleted_plan || deleted_plan.nModified < 1) {
                throw new NotFoundException(MessageConstants.NOT_MODIFIED)
            }
            return res.status(HttpStatus.OK).json({
                message: MessageConstants.DELETED_SUCCESS,
                data: { id }
            })
        }
        catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}

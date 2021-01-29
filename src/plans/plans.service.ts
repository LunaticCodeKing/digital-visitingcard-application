import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IPlan } from './interfaces/plans.interface';
import { CreatePlanDTO } from './dto/create-plans.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlansService {

    constructor(@InjectModel('plans') private plansModel: Model<IPlan>,
        private configService: ConfigService) { }

    private readonly logger = new Logger('Plans')

    async create(createPlanDTO: CreatePlanDTO): Promise<IPlan> {
        const createdPlan = new this.plansModel(createPlanDTO);
        return createdPlan.save();
    }

    async findOne(filterQuery: any = {}): Promise<IPlan> {
        return this.plansModel.findOne(filterQuery).exec();
    }

    async countAll(filterQuery: any = {}): Promise<number> {
        return this.plansModel.countDocuments(filterQuery).exec();
    }

    async findAll(filterQuery: any = {}, skip, limit): Promise<IPlan[]> {
        return this.plansModel.find(filterQuery).skip(parseInt(skip)).limit(parseInt(limit)).exec();
    }

    async updateOne(filterQuery: any = {}, updateQuery): Promise<IPlan> {
        return this.plansModel.findOneAndUpdate(filterQuery, updateQuery, { new: true, useFindAndModify: false }).exec();
    }

    async updateMany(filterQuery, updateQuery): Promise<any> {
        return this.plansModel.updateMany(filterQuery, { $set: updateQuery }).exec();
    }

    async deleteOne(id): Promise<any> {
        return this.plansModel.updateOne({ _id: id, is_deleted: false }, { $set: { is_deleted: true } }).exec()
    }

    async deleteMany(ids): Promise<any> {
        return this.plansModel.updateMany({ _id: { $in: ids }, is_deleted: false }, { $set: { is_deleted: true } }).exec()
    }

    async discountCalc(data: any): Promise<any> {
        let discount_price: number = 0, price: number = 0;
        if (data.discount_type == 'flat') {
            price = (data.base_price - data.discount_value);
            discount_price = data.discount_value;
        }
        else if (data.discount_type == 'percentage') {
            discount_price = Math.round((data.base_price * data.discount_value) / 100);
            price = data.base_price - discount_price;
        }
        else {
            price = data.base_price;
            discount_price = 0
        }
        return { discount_price, price }
    }
}

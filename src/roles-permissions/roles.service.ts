import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRole } from './interfaces/roles.interface'
import { CreateRoleDTO } from './dto/create-roles.dto';

@Injectable()
export class RolesService {
    constructor(@InjectModel('Roles') private rolesModel: Model<IRole>) {}

    async create(createRoleDTO: CreateRoleDTO): Promise<IRole> {
        const createdRole = new this.rolesModel(createRoleDTO);
        return createdRole.save();
    }

    async findOne(filterQuery:any = {}): Promise<IRole> {
        return this.rolesModel.findOne(filterQuery).exec();
    }

    async countAll(filterQuery:any = {}): Promise<number> {
        return this.rolesModel.countDocuments(filterQuery).exec();
    }

    async findAll(filterQuery:any = {}, skip, limit): Promise<IRole[]> {
        return this.rolesModel.find(filterQuery).skip(parseInt(skip)).limit(parseInt(limit)).exec();
    }

    async updateOne(filterQuery:any = {}, updateQuery): Promise<IRole> {
        return this.rolesModel.findOneAndUpdate(filterQuery, updateQuery, { new : true, useFindAndModify: false}).exec();
    }

    async updateMany(filterQuery, updateQuery): Promise<any> {
        return this.rolesModel.updateMany(filterQuery, {$set: updateQuery}).exec();
    }

    async deleteOne(id): Promise<any> {
        return this.rolesModel.updateOne({_id: id, is_primary_role: false, is_deleted: false}, { $set: { is_deleted: true }}).exec()
    }

    async deleteMany(ids): Promise<any> {
        return this.rolesModel.updateMany({_id: { $in : ids }, is_primary_role: false, is_deleted: false}, { $set: { is_deleted: true }}).exec()
    }
}

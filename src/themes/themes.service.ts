import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ITheme } from './interfaces/themes.interface'
import { CreateThemeDTO } from './dto/create-themes.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThemesService {

    constructor(@InjectModel('themes') private themesModel: Model<ITheme>,
        private configService: ConfigService) { }

    private readonly logger = new Logger('Themes')

    async create(createThemeDTO: CreateThemeDTO): Promise<ITheme> {

        const createdTheme = new this.themesModel(createThemeDTO);
        return createdTheme.save();
    }

    async findOne(filterQuery: any = {}): Promise<ITheme> {
        return this.themesModel.findOne(filterQuery).exec();
    }

    async countAll(filterQuery: any = {}): Promise<number> {
        return this.themesModel.countDocuments(filterQuery).exec();
    }

    async findAll(filterQuery: any = {}, skip, limit): Promise<ITheme[]> {
        return this.themesModel.find(filterQuery).skip(parseInt(skip)).limit(parseInt(limit)).exec();
    }

    async updateOne(filterQuery: any = {}, updateQuery): Promise<ITheme> {
        return this.themesModel.findOneAndUpdate(filterQuery, updateQuery, { new: true, useFindAndModify: false }).exec();
    }

    async updateMany(filterQuery, updateQuery): Promise<any> {
        return this.themesModel.updateMany(filterQuery, { $set: updateQuery }).exec();
    }

    async deleteOne(id): Promise<any> {
        return this.themesModel.updateOne({ _id: id, is_deleted: false }, { $set: { is_deleted: true } }).exec()
    }

    async deleteMany(ids): Promise<any> {
        return this.themesModel.updateMany({ _id: { $in: ids }, is_deleted: false }, { $set: { is_deleted: true } }).exec()
    }
}


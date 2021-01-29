import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlansSchema } from './schemas/plans.schemas';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports:[MongooseModule.forFeatureAsync([
    { 
      name: 'plans', 
      useFactory: () => {
        const schema = PlansSchema
        schema.plugin(require('mongoose-autopopulate'));
        return schema;
      },
  }])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService] 
})
export class PlansModule {}

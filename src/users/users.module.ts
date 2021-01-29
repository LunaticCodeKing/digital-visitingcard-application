import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './schemas/users.schemas';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports:[MongooseModule.forFeatureAsync([
    { 
      name: 'Users', 
      useFactory: () => {
        const schema = UsersSchema
        schema.plugin(require('mongoose-autopopulate'));
        return schema;
      },
  }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] 
})
export class UsersModule {}

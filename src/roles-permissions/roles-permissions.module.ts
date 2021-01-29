import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesPermissionsController } from './roles-permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesSchema } from './schemas/roles.schemas';
import { PermissionsService } from './permissions.service';

@Module({
  imports:[MongooseModule.forFeatureAsync([
    { 
      name: 'Roles', 
      useFactory: () => {
        const schema = RolesSchema
        return schema;
      },
  }])],
  providers: [RolesService, PermissionsService],
  controllers: [RolesPermissionsController],
  exports: [RolesService]
})
export class RolesPermissionsModule {}

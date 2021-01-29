import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvSchemaValidator } from './env.validation'
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { ThemesModule } from './themes/themes.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvSchemaValidator,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      }
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }),
    }),
    FilesModule,
    UsersModule,
    RolesPermissionsModule,
    AuthModule,
    PlansModule,
    ThemesModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
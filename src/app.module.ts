import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './auth/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DB_NAME'),
        entities: [User, Report],
        synchronize: true,
      }),
    }),
    AuthModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    }
  ],
})
export class AppModule {
  constructor(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: ['1234S6'],
      })
    ).forRoutes('*');
  }
}

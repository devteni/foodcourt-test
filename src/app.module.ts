import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KnexModule } from 'nest-knexjs';
import * as dotenv from 'dotenv';
import { BrandsModule } from './brands/brands.module';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;

console.log(process.env.DB_USER);

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule.forRoot({
      config: {
        client: 'pg',
        useNullAsDefault: true,
        connection: {
          host: DB_HOST,
          port: parseInt(DB_PORT, 10),
          user: DB_USER,
          password: DB_PASS,
          database: 'foodcourt',
        },
      },
    }),
    BrandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class BrandsModule {}

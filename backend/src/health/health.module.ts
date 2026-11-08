import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { HealthService } from './health.service.js';

@Module({
  controllers: [HealthController],
  providers: [PrismaService, HealthService],
})
export class HealthModule {}

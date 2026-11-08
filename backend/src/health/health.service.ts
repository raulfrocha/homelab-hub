import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async checkDatabaseConnection(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'Database connection is healthy';
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 503,
        error: 'Database connection check failed',
        message: error,
      });
    }
  }


}

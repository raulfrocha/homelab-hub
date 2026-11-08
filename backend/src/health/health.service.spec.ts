import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { vi } from 'vitest';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
          },
        },
      ],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(healthService).toBeDefined();
  });
});
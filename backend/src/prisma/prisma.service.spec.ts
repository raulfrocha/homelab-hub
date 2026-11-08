import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';
import { vi } from 'vitest';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => 'postgresql://user:pass@localhost:5432/db'),
            getOrThrow: vi.fn((key: string) => 'postgresql://user:pass@localhost:5432/db'),
          },
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });
});
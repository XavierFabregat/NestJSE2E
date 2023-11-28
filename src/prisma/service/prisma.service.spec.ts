import { mock } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { MOCK_DB_ENV } from '../../../test/mock.data';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let configService: ConfigService;
  beforeEach(async () => {
    configService = mock<ConfigService>(
      {
        get: jest.fn(
          (envVar: string) =>
            envVar === 'DATABASE_URL'
              ? MOCK_DB_ENV
              : envVar,
        ),
      },
    );
    prismaService = new PrismaService(
      configService,
    );
    prismaService.user.deleteMany =
      jest.fn();
    prismaService.bookmark.deleteMany =
      jest.fn();
    prismaService.$transaction =
      jest.fn();
  });
  describe('cleanDb', () => {
    it('should call $transaction with the correct arguments', async () => {
      const spyTransaction = jest.spyOn(
        prismaService,
        '$transaction',
      );
      await prismaService.cleanDb();
      expect(
        spyTransaction,
      ).toHaveBeenCalledTimes(1);
      expect(
        prismaService.user.deleteMany,
      ).toHaveBeenCalledTimes(1);
      expect(
        prismaService.bookmark
          .deleteMany,
      ).toHaveBeenCalledTimes(1);
    });
  });
});

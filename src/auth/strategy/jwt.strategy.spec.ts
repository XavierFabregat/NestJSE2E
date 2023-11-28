import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/service/prisma.service';
import { mock } from 'jest-mock-extended';
import { mockUsers } from '../../../test/mock.data';
import { createMock } from '@golevelup/ts-jest';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let mockConfigService: ConfigService;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    mockConfigService =
      mock<ConfigService>({
        get: jest.fn((envVar) =>
          envVar === 'JWT_SECRET'
            ? 'mock-secret'
            : envVar,
        ),
      });

    mockPrismaService =
      createMock<PrismaService>({
        user: {
          findUnique: jest.fn(
            () =>
              new Promise((res) =>
                res(mockUsers[0]),
              ),
          ),
        },
      });

    jwtStrategy = new JwtStrategy(
      mockConfigService,
      mockPrismaService,
    );
  });

  describe('validate', () => {
    const user = mockUsers[0];
    it('should return the user if it is found', async () => {
      const result =
        await jwtStrategy.validate({
          sub: user.id,
          email: user.email,
        });
      expect(result).toEqual(user);
    });
  });
});

import { PrismaService } from 'src/prisma/service/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { mockUsers } from '../../../test/mock.data';
import { AuthDto } from '../dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common';

jest.mock('argon2', () => ({
  __esModule: true,
  verify: jest.fn(
    (_hash, password) =>
      new Promise((res) => {
        if (
          password === 'wrong-password'
        )
          res(false);
        res(true);
      }),
  ),
  hash: jest.fn(
    () =>
      new Promise((res) =>
        res('mock-password'),
      ),
  ),
}));
describe('Auth Service', () => {
  let authService: AuthService;
  let mockPrismaService: PrismaService;
  let mockJwtService: JwtService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    mockPrismaService =
      createMock<PrismaService>({
        user: {
          create: jest.fn(
            ({ data }) =>
              new Promise((res) => {
                if (
                  data.email.includes(
                    'taken',
                  )
                ) {
                  throw new PrismaClientKnownRequestError(
                    '',
                    {
                      code: 'P2002',
                      clientVersion: '',
                    },
                  );
                }
                if (
                  data.email.includes(
                    'force',
                  )
                ) {
                  throw new Error(
                    'mock-error',
                  );
                }
                res(mockUsers[0]);
              }),
          ),
          findUnique: jest.fn(
            ({ where }) =>
              new Promise((res) => {
                if (
                  where.email ===
                  mockUsers[0].email
                ) {
                  res(mockUsers[0]);
                }
                res(undefined);
              }),
          ),
        },
      });
    mockJwtService =
      createMock<JwtService>({
        signAsync: jest.fn(
          () =>
            new Promise((res) =>
              res('mock-token'),
            ),
        ),
      });
    mockConfigService =
      createMock<ConfigService>({
        get: jest.fn((envVar) =>
          envVar === 'JWT_SECRET'
            ? 'mock-secret'
            : envVar,
        ),
      });

    authService = new AuthService(
      mockPrismaService,
      mockJwtService,
      mockConfigService,
    );
  });

  describe('Sing Up', () => {
    it('should return the access token if succeddful', async () => {
      const dto: AuthDto = {
        email: mockUsers[0].email,
        password: 'mock-password',
      };
      const result =
        await authService.signup(dto);
      expect(result).toEqual({
        access_token: 'mock-token',
      });

      expect(
        mockPrismaService.user.create,
      ).toHaveBeenCalledTimes(1);
    });
    it('should throw and error if the email is already taken', async () => {
      const dto: AuthDto = {
        email: mockUsers[1].email,
        password: 'mock-password',
      };
      try {
        await authService.signup(dto);
        fail(
          'it should have thrown an error',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          ForbiddenException,
        );
        expect(error.message).toBe(
          'Credentials taken',
        );
      }
    });

    it('should throw other errors', async () => {
      const dto: AuthDto = {
        email: 'force@error.com',
        password: 'mock-password',
      };
      try {
        await authService.signup(dto);
        fail(
          'it should have thrown an error',
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(
          Error,
        );
      }
    });
  });

  describe('Sign In', () => {
    it('should return the access token if successful', async () => {
      const dto: AuthDto = {
        email: mockUsers[0].email,
        password: 'mock-password',
      };
      const result =
        await authService.signin(dto);
      expect(result).toEqual({
        access_token: 'mock-token',
      });
    });
    it('should throw a ForbbiddenException if user does not exist', async () => {
      const dto: AuthDto = {
        email: 'not@exist.com',
        password: 'mock-password',
      };
      try {
        await authService.signin(dto);
        fail(
          'it should have thrown an error',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          ForbiddenException,
        );
        expect(error.message).toBe(
          'Credentials Incorrect',
        );
      }
    });
    it('should throw a ForbbiddenException if password is incorrect', async () => {
      const dto: AuthDto = {
        email: mockUsers[0].email,
        password: 'wrong-password',
      };
      try {
        await authService.signin(dto);
        fail(
          'it should have thrown an error',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          ForbiddenException,
        );
        expect(error.message).toBe(
          'Credentials Incorrect',
        );
      }
    });
  });
});

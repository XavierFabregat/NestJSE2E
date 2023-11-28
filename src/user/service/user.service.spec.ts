import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UserService } from './user.service';
import {
  mockUsers,
  updatedUser,
} from '../../../test/mock.data';
import { EditUserDto } from '../dto';
import { ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UserService', () => {
  let userService: UserService;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    mockPrismaService =
      createMock<PrismaService>({
        user: {
          update: jest.fn(
            (
              { where, data }, // eslint-disable-line
            ) =>
              new Promise((res) => {
                if (
                  data.email ===
                  'force@error.com'
                ) {
                  throw new Error(
                    'Testing that other errors are still thrown',
                  );
                }
                if (
                  data.email ===
                  mockUsers[1].email
                )
                  throw new PrismaClientKnownRequestError(
                    '',
                    {
                      code: 'P2002',
                      clientVersion: '',
                    },
                  );
                res(updatedUser);
              }),
          ),
        },
      });

    userService = new UserService(
      mockPrismaService,
    );
  });

  describe('editUser', () => {
    it('should update the user', async () => {
      const mockUser = mockUsers[0];
      const dto: EditUserDto & {
        updatedAt: Date;
      } = {
        email: 'edit@example.com',
        firstName: 'Edit',
        lastName: 'McEditson',
        updatedAt: new Date(),
      };
      const result =
        await userService.editUser(
          mockUser.id,
          dto,
        );
      expect(result).toEqual(
        updatedUser,
      );
      expect(
        mockPrismaService.user.update,
      ).toHaveReturnedTimes(1);
      expect(
        mockPrismaService.user.update,
      ).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { ...dto },
      });
    });

    it('should throw an error if the email is taken', async () => {
      const mockUser = mockUsers[0];
      const takenDto: EditUserDto = {
        ...mockUser,
        email: mockUsers[1].email,
      };
      try {
        await userService.editUser(
          mockUser.id,
          takenDto,
        );
        // fail the test if the above function doesn't throw
        fail(
          'It should not reach here',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          ForbiddenException,
        );
      }
    });

    it('should throw other errors if they happen', async () => {
      const mockUser = mockUsers[0];
      const errorDto: EditUserDto = {
        email: 'force@error.com',
      };
      try {
        await userService.editUser(
          mockUser.id,
          errorDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          Error,
        );
      }
    });
  });
});

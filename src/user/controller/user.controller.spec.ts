import { mock } from 'jest-mock-extended';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';
import {
  mockUsers,
  updatedUser,
} from '../../../test/mock.data';
import { EditUserDto } from '../dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    userService = mock<UserService>({
      editUser: jest.fn(
        () =>
          new Promise((res) =>
            res(updatedUser),
          ),
      ),
    });
    userController = new UserController(
      userService,
    );
  });

  describe('getMe', () => {
    it('should return the current logged user', () => {
      const mockUser = mockUsers[0];
      const reuslt =
        userController.getMe(mockUser);
      expect(reuslt).toEqual(mockUser);
    });
  });

  describe('editUser', () => {
    it('should update the user', async () => {
      const userId = mockUsers[0].id;
      const dto: EditUserDto = {
        ...mockUsers[0],
        email: 'edit@example.com',
        firstName: 'Edit',
        lastName: 'McEditson',
      };
      const result =
        await userController.editUser(
          userId,
          dto,
        );
      expect(result).toEqual(
        updatedUser,
      );
    });
  });
});

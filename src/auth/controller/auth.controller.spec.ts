import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';
import { AuthDto } from '../dto';
import { mockUsers } from '../../../test/mock.data';

describe('Auth Controller', () => {
  let authController: AuthController;
  let mockAuthService: AuthService;

  beforeEach(async () => {
    mockAuthService =
      createMock<AuthService>({
        signup: jest.fn(),
        signin: jest.fn(),
      });

    authController = new AuthController(
      mockAuthService,
    );
  });

  describe('Sign Up', () => {
    const dto: AuthDto = {
      email: mockUsers[0].email,
      password: 'mock-password',
    };
    it('should call the signup method of the auth service with the correct arguments', async () => {
      await authController.signup(dto);
      expect(
        mockAuthService.signup,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockAuthService.signup,
      ).toHaveBeenCalledWith(dto);
    });
  });

  describe('Sign In', () => {
    const dto: AuthDto = {
      email: mockUsers[0].email,
      password: 'mock-password',
    };
    it('should call the signin method of the auth service with the correct arguments', async () => {
      await authController.signin(dto);
      expect(
        mockAuthService.signin,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockAuthService.signin,
      ).toHaveBeenCalledWith(dto);
    });
  });
});

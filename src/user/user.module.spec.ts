import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

describe('UserModule', () => {
  let userModule: TestingModule;

  beforeEach(async () => {
    userModule =
      await Test.createTestingModule({
        imports: [UserModule],
      }).compile();
  });

  it('should be defined', () => {
    expect(userModule).toBeDefined();
  });

  it('should have the correct imports and providers', () => {
    expect(
      userModule.get<UserService>(
        UserService,
      ),
    ).toBeDefined();
    expect(
      userModule.get<UserController>(
        UserController,
      ),
    ).toBeDefined();
  });
});

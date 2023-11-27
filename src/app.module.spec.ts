import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should have the correct imports', () => {
    expect(
      appModule.get<AuthModule>(
        AuthModule,
      ),
    ).toBeDefined();
    expect(
      appModule.get<UserModule>(
        UserModule,
      ),
    ).toBeDefined();
    expect(
      appModule.get<BookmarkModule>(
        BookmarkModule,
      ),
    ).toBeDefined();
    expect(
      appModule.get<PrismaModule>(
        PrismaModule,
      ),
    ).toBeDefined();
    expect(
      appModule.get<ConfigModule>(
        ConfigModule,
      ),
    ).toBeDefined();
  });
});

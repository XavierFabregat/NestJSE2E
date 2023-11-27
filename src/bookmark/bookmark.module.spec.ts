import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { BookmarkModule } from './bookmark.module';
import { BookmarkService } from './service/bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
describe('BookmarkModule', () => {
  let bookmarkModule: TestingModule;

  beforeEach(async () => {
    bookmarkModule =
      await Test.createTestingModule({
        imports: [BookmarkModule],
      }).compile();
  });

  it('should be defined', () => {
    expect(
      bookmarkModule,
    ).toBeDefined();
  });

  it('should have the correct providers', () => {
    expect(
      bookmarkModule.get(
        BookmarkService,
      ),
    ).toBeDefined();

    expect(
      bookmarkModule.get(PrismaService),
    ).toBeDefined();

    expect(
      bookmarkModule.get(ConfigService),
    ).toBeDefined();
  });
});

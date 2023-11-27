import { Module } from '@nestjs/common';
import { BookmarkController } from './controller/bookmark.controller';
import { BookmarkService } from './service/bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BookmarkController],
  providers: [
    BookmarkService,
    PrismaService,
    ConfigService,
  ],
  exports: [BookmarkService],
})
export class BookmarkModule {}

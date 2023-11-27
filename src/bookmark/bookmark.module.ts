import { Module } from '@nestjs/common';
import { BookmarkController } from './controller/bookmark.controller';
import { BookmarkService } from './service/bookmark.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}

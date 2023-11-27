import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '../../prisma/prisma.service';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from '@prisma/client';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from '../dto';
import { ForbiddenException } from '@nestjs/common';

const mockBookmarks: Bookmark[] = [
  {
    id: 1,
    link: 'https://nestjs.com',
    title: 'NestJS',
    description: 'NestJS Framework',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    link: 'https://example.com',
    title: 'Example',
    description: 'Example description',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    link: 'https://example.com',
    title: 'Example',
    description: 'Example description',
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUpdatedBookmark: Bookmark = {
  ...mockBookmarks[0],
  link: 'https://nestjs.com',
  title: 'NestJS is Awesome',
  description: 'Updated description',
  updatedAt: new Date(),
};

describe('BookmarkService', () => {
  let mockPrismaService: PrismaService;
  let bookmarkService: BookmarkService;
  beforeEach(async () => {
    mockPrismaService =
      createMock<PrismaService>({
        bookmark: {
          create: jest.fn(
            () =>
              new Promise((res) =>
                res(mockBookmarks[0]),
              ),
          ),
          findMany: jest.fn(
            () =>
              new Promise((res) =>
                res(
                  mockBookmarks.filter(
                    (bm) =>
                      bm.userId === 1,
                  ),
                ),
              ),
          ),
          findFirst: jest.fn(
            ({ where }) => {
              return new Promise(
                (res) => {
                  const targetBookmark =
                    mockBookmarks.find(
                      (bm) =>
                        bm.id ===
                        where.id,
                    );
                  if (
                    targetBookmark.userId ===
                    where.userId
                  ) {
                    return res(
                      targetBookmark,
                    );
                  }
                  res('');
                },
              );
            },
          ),
          findUnique: jest.fn(
            () =>
              new Promise((res) =>
                res(mockBookmarks[0]),
              ),
          ),
          update: jest.fn(
            () =>
              new Promise((res) =>
                res(
                  mockUpdatedBookmark,
                ),
              ),
          ),
          delete: jest.fn(),
        },
      });

    bookmarkService =
      new BookmarkService(
        mockPrismaService,
      );
  });

  describe('createBookmark', () => {
    it('should create bookmark', async () => {
      const createBookmarkInputs: [
        number,
        CreateBookmarkDto,
      ] = [
        mockBookmarks[0].userId,
        {
          title: 'NestJS',
          link: 'https://nestjs.com',
          description:
            'NestJS Framework',
        },
      ];
      const result =
        await bookmarkService.createBookmark(
          ...createBookmarkInputs,
        );

      expect(result).toBe(
        mockBookmarks[0],
      );
      expect(
        mockPrismaService.bookmark
          .create,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .create,
      ).toHaveBeenCalledWith({
        data: {
          userId:
            createBookmarkInputs[0],
          ...createBookmarkInputs[1],
        },
      });
    });
  });

  describe('getBookmarks', () => {
    it('should return all user bookmarks', async () => {
      const result =
        await bookmarkService.getBookmarks(
          mockBookmarks[0].userId,
        );

      const expectedResult =
        mockBookmarks.filter(
          (bm) =>
            bm.userId ===
            mockBookmarks[0].userId,
        );

      expect(result).toEqual(
        expectedResult,
      );
      expect(
        mockPrismaService.bookmark
          .findMany,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findMany,
      ).toHaveBeenCalledWith({
        where: {
          userId:
            mockBookmarks[0].userId,
        },
      });
    });
  });

  describe('getBookmarkById', () => {
    it('should return bookmark of given id if it belongs to the user', async () => {
      const result =
        await bookmarkService.getBookmarkById(
          1,
          1,
        );
      expect(result).toBe(
        mockBookmarks[0],
      );

      expect(
        mockPrismaService.bookmark
          .findFirst,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findFirst,
      ).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
    });
    it('should not return bookmark of given id if it deoes not belongs to the user', async () => {
      const result =
        await bookmarkService.getBookmarkById(
          1,
          3,
        );
      expect(result).toBe('');
      expect(
        mockPrismaService.bookmark
          .findFirst,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findFirst,
      ).toHaveBeenCalledWith({
        where: { id: 3, userId: 1 },
      });
    });
  });

  describe('editBookmarkById', () => {
    const editBookmarkDto: EditBookmarkDto =
      {
        title: 'NestJS is Awesome',
        description:
          'Updated description',
      };

    it('should edit bookmark if user is owner', async () => {
      const result =
        await bookmarkService.editBookmarkById(
          1,
          1,
          editBookmarkDto,
        );

      expect(result).toEqual(
        mockUpdatedBookmark,
      );
      expect(
        mockPrismaService.bookmark
          .update,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .update,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...editBookmarkDto },
      });
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw if user is not the owner', async () => {
      try {
        await bookmarkService.editBookmarkById(
          2,
          1,
          editBookmarkDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          ForbiddenException,
        );
      }
      expect(
        mockPrismaService.bookmark
          .update,
      ).toHaveBeenCalledTimes(0);
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('deleteBookmarkById', () => {
    it('should delete bookmark if user is owner', async () => {
      const result =
        await bookmarkService.deleteBookmarkById(
          1,
          1,
        );
      expect(result).toBeUndefined();
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(
        mockPrismaService.bookmark
          .delete,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .delete,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
    it('should throw ForbiddenException if user is not owner', async () => {
      try {
        await bookmarkService.deleteBookmarkById(
          2,
          1,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(
          ForbiddenException,
        );
        expect(error.message).toBe(
          'Access to resource denied.',
        );
      }
      expect(
        mockPrismaService.bookmark
          .update,
      ).toHaveBeenCalledTimes(0);
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockPrismaService.bookmark
          .findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

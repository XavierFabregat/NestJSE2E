import { BookmarkService } from '../service/bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { mock } from 'jest-mock-extended';
import {
  mockBookmarks,
  mockUpdatedBookmark,
} from '../../../test/mock.data';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from '../dto';
describe('BookmarkController', () => {
  let bookmarkController: BookmarkController;
  let mockBookmarkService: BookmarkService;

  beforeEach(async () => {
    mockBookmarkService =
      mock<BookmarkService>({
        createBookmark: jest.fn(
          () =>
            new Promise((res) =>
              res(mockBookmarks[0]),
            ),
        ),
        getBookmarks: jest.fn(
          (userId) =>
            new Promise((res) =>
              res(
                mockBookmarks.filter(
                  (bm) =>
                    bm.userId ===
                    userId,
                ),
              ),
            ),
        ),
        getBookmarkById: jest.fn(
          (id, userId) =>
            new Promise((res) =>
              res(
                mockBookmarks.find(
                  (bm) =>
                    bm.id === id &&
                    bm.userId ===
                      userId,
                ),
              ),
            ),
        ),
        deleteBookmarkById: jest.fn(
          () =>
            new Promise((res) => res()),
        ),
        editBookmarkById: jest.fn(
          () =>
            new Promise((res) =>
              res(mockUpdatedBookmark),
            ),
        ),
      });

    bookmarkController =
      new BookmarkController(
        mockBookmarkService,
      );
  });

  describe('/POST /bookmarks', () => {
    it('should create a bookmark with the appropiate userId', async () => {
      const dto: CreateBookmarkDto = {
        ...mockBookmarks[0],
      };
      const result =
        await bookmarkController.createBookmark(
          mockBookmarks[0].userId,
          dto,
        );

      expect(result).toBe(
        mockBookmarks[0],
      );
      expect(
        mockBookmarkService.createBookmark,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockBookmarkService.createBookmark,
      ).toHaveBeenCalledWith(
        mockBookmarks[0].userId,
        dto,
      );
    });
  });

  describe('/GET /bookmarks', () => {
    it('should return all user bookmarks', async () => {
      const userId =
        mockBookmarks[0].userId;
      const expectedResult =
        mockBookmarks.filter(
          (bm) => bm.userId === userId,
        );
      const result =
        await bookmarkController.getBookmarks(
          userId,
        );
      expect(result).toEqual(
        expectedResult,
      );
      expect(
        mockBookmarkService.getBookmarks,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('/GET /bookmarks/:id', () => {
    it('should return a bookmark by id and userId', async () => {
      const expectedResult =
        mockBookmarks[0];

      const result =
        await bookmarkController.getBookmarkById(
          1,
          1,
        );

      expect(result).toEqual(
        expectedResult,
      );

      expect(
        mockBookmarkService.getBookmarkById,
      ).toHaveBeenCalledTimes(1);
    });

    it('should not return undefined if id is bad', async () => {
      const result =
        await bookmarkController.getBookmarkById(
          1,
          500,
        );
      expect(result).toBeUndefined();
      expect(
        mockBookmarkService.getBookmarkById,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if user does not own bookmark', async () => {
      const result =
        await bookmarkController.getBookmarkById(
          1,
          2,
        );
      expect(result).toBeUndefined();
      expect(
        mockBookmarkService.getBookmarkById,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('/PATCH /bookmarks/:id', () => {
    it('should edit a bookmark by id', async () => {
      const expectedResult =
        mockUpdatedBookmark;
      const dto: EditBookmarkDto = {
        link: mockUpdatedBookmark.link,
        title:
          mockUpdatedBookmark.title,
        description:
          mockUpdatedBookmark.description,
      };
      const result =
        await bookmarkController.editBookmarkById(
          1,
          1,
          dto,
        );
      expect(result).toEqual(
        expectedResult,
      );
      expect(
        mockBookmarkService.editBookmarkById,
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('/DELETE /bookmarks/:id', () => {
    it('sohuld delete a bookmark by id', async () => {
      const result =
        await bookmarkController.deleteBookmarkById(
          1,
          1,
        );
      expect(result).toBeUndefined();
      expect(
        mockBookmarkService.deleteBookmarkById,
      ).toHaveBeenCalledTimes(1);
    });
  });
});

import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/service/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app =
      moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(5050);
    prisma = app.get<PrismaService>(
      PrismaService,
    );
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:5050',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@example.com',
      password: '123',
    };
    // const badEmail: AuthDto = {
    //   email: 'bad@example.com',
    //   password: '123',
    // };
    // const badPassword: AuthDto = {};
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('should throw if email is taken', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'taken@example.com',
            password: '123',
          });
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'taken@example.com',
            password: '123',
          })
          .expectStatus(403);
      });

      it('should signup', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should Sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores(
            'userAt',
            'access_token',
          );
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should throw if no access_token is provided', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(401);
      });
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      const editDto: EditUserDto = {
        email: 'edit@example.com',
        lastName: 'Doe',
        firstName: 'John',
      };

      const takenDto: EditUserDto = {
        ...editDto,
        email: 'taken@example.com',
      };

      it('should thorw if no access_token is provided', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(editDto)
          .expectStatus(401);
      });

      it('should throw if email is taken', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(takenDto)
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });

      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(editDto)
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains(
            editDto.email,
          )
          .expectBodyContains(
            editDto.firstName,
          )
          .expectBodyContains(
            editDto.lastName,
          );
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'Fisrt Bookmark',
        link: 'https://example.com',
        description:
          'Example Description',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get User Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark by Id', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams(
            'id',
            '$S{bookmarkId}',
          )
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains(
            '$S{bookmarkId}',
          );
      });
    });
    describe('Edit Bookmark by Id', () => {
      const dto: EditBookmarkDto = {
        title: 'Edited Title',
        description:
          'Edited Description',
        link: 'https://www.youtube.com/@freecodecamp',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams(
            'id',
            '$S{bookmarkId}',
          )
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectBodyContains(
            dto.description,
          )
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .expectStatus(200);
      });
    });
    describe('Delete Bookmark by Id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams(
            'id',
            '$S{bookmarkId}',
          )
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams(
            'id',
            '$S{bookmarkId}',
          )
          .withHeaders({
            Authorization:
              'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('');
      });
    });
  });
});

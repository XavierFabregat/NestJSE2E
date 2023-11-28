import { Bookmark } from '@prisma/client';

export const mockUsers = [
  {
    id: 1,
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: 'taken@test.com',
    firstName: 'Taken',
    lastName: 'McTakenson',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const updatedUser = {
  ...mockUsers[0],
  email: 'edit@example.com',
  firstName: 'Edit',
  lastName: 'McEditson',
  updatedAt: new Date(),
};

export const updatedUserInput = {
  id: mockUsers[0].id,
  firstName: 'Updated',
};

export const mockBookmarks: Bookmark[] =
  [
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
      description:
        'Example description',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      link: 'https://example.com',
      title: 'Example',
      description:
        'Example description',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

export const mockUpdatedBookmark: Bookmark =
  {
    ...mockBookmarks[0],
    link: 'https://nestjs.com',
    title: 'NestJS is Awesome',
    description: 'Updated description',
    updatedAt: new Date(),
  };

export const mockUsers = [
  {
    id: 1,
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const updatedUser = {
  ...mockUsers[0],
  firstName: 'Updated',
  updatedAt: new Date(),
};

export const updatedUserInput = {
  id: mockUsers[0].id,
  firstName: 'Updated',
};

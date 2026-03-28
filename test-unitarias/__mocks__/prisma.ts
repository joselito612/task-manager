const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  password: '$2a$10$hashedpassword',
  role: 'USER',
  createdAt: new Date(),
}

const mockTask = {
  id: 'task-456',
  title: 'Test Task',
  description: 'Test description',
  completed: false,
  userId: 'user-123',
  createdAt: new Date(),
}

export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  task: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

export { mockUser, mockTask }

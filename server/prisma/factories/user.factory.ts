import { faker } from '@faker-js/faker';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  constructor(private prisma: PrismaClient) {}

  async create(overrides: any = {}) {
    const password = await bcrypt.hash('password123', 12);

    return this.prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password,
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        avatar: faker.image.avatar(),
        role: Role.USER,
        ...overrides,
      },
    });
  }

  async createMany(count: number, overrides: any = {}) {
    const users: any[] = [];
    for (let i = 0; i < count; i++) {
      const user = await this.create(overrides);
      users.push(user);
    }
    return users;
  }
}

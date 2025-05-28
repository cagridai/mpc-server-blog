import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

export class CategoryFactory {
  constructor(private prisma: PrismaClient) {}

  async create(overrides: any = {}) {
    const baseName = faker.commerce.productAdjective();
    const uniqueSuffix = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    const name = `${baseName}-${uniqueSuffix}`;

    return this.prisma.category.create({
      data: {
        name,
        description: faker.lorem.sentence(),
        slug: slugify(name, { lower: true, strict: true }),
        ...overrides,
      },
    });
  }

  async createMany(count: number, overrides: any = {}) {
    const categories: any[] = [];
    for (let i = 0; i < count; i++) {
      const category = await this.create(overrides);
      categories.push(category);
    }
    return categories;
  }
}

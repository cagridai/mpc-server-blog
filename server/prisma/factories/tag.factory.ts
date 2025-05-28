import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

export class TagFactory {
  constructor(private prisma: PrismaClient) {}

  async create(overrides: any = {}) {
    const tagSources = [
      () => faker.commerce.productAdjective(),
      () => faker.color.human(),
      () => faker.hacker.adjective(),
      () => faker.word.adjective(),
      () => faker.company.buzzAdjective(),
    ];

    const randomSource = faker.helpers.arrayElement(tagSources);
    const baseName = randomSource();
    const name = `${baseName}-${faker.string.alphanumeric(4)}`;

    return this.prisma.tag.create({
      data: {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        ...overrides,
      },
    });
  }

  async createMany(count: number, overrides: any = {}) {
    const tags: any[] = [];
    for (let i = 0; i < count; i++) {
      const tag = await this.create(overrides);
      tags.push(tag);
    }
    return tags;
  }
}

import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

export class PostFactory {
  constructor(private prisma: PrismaClient) {}

  async create(authorId: string, overrides: any = {}) {
    const title = faker.lorem.sentence();

    return this.prisma.post.create({
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        content: faker.lorem.paragraphs(5, '\n\n'),
        excerpt: faker.lorem.paragraph(),
        published: faker.datatype.boolean(),
        featured: faker.datatype.boolean({ probability: 0.2 }),
        authorId,
        ...overrides,
      },
    });
  }

  async createMany(count: number, authorId: string, overrides: any = {}) {
    const posts: any[] = [];
    for (let i = 0; i < count; i++) {
      const post = await this.create(authorId, overrides);
      posts.push(post);
    }
    return posts;
  }
}

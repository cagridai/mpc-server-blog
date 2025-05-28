// test/utils/test-utils.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

export async function cleanDatabase(prisma: PrismaService) {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(prisma: PrismaService, overrides = {}) {
  const password = await bcrypt.hash('test123', 12);

  return prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      password,
      name: 'Test User',
      ...overrides,
    },
  });
}

export async function createTestCategory(
  prisma: PrismaService,
  overrides = {},
) {
  return prisma.category.create({
    data: {
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      ...overrides,
    },
  });
}

export async function createTestPost(
  prisma: PrismaService,
  authorId: string,
  overrides = {},
) {
  return prisma.post.create({
    data: {
      title: 'Test Post',
      slug: 'test-post',
      content: 'This is a test post content.',
      excerpt: 'Test excerpt',
      published: true,
      authorId,
      ...overrides,
    },
  });
}

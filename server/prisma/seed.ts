// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import { UserFactory } from './factories/user.factory';
import { CategoryFactory } from './factories/category.factory';
import { TagFactory } from './factories/tag.factory';
import { PostFactory } from './factories/post.factory';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create factories
  const userFactory = new UserFactory(prisma);
  const categoryFactory = new CategoryFactory(prisma);
  const tagFactory = new TagFactory(prisma);
  const postFactory = new PostFactory(prisma);

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@blog.com',
      username: 'admin',
      password: adminPassword,
      name: 'Admin User',
      bio: 'System administrator and blogger',
      role: Role.ADMIN,
    },
  });

  // Create test user
  const testPassword = await bcrypt.hash('test123', 12);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@blog.com',
      username: 'testuser',
      password: testPassword,
      name: 'Test User',
      bio: 'Just a test user',
      role: Role.USER,
    },
  });

  // Create additional users
  const users = await userFactory.createMany(10);
  const allUsers = [admin, testUser, ...users];

  // Create categories
  const categories = await categoryFactory.createMany(8);

  // Create tags
  const tags = await tagFactory.createMany(20);

  // Create posts
  for (const user of allUsers) {
    const postCount = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < postCount; i++) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 1);

      await postFactory.create(user.id, {
        categoryId: randomCategory.id,
        tags: {
          connect: randomTags.map((tag) => ({ id: tag.id })),
        },
      });
    }
  }

  // Create comments
  const posts = await prisma.post.findMany();

  for (const post of posts) {
    const commentCount = Math.floor(Math.random() * 8);

    for (let i = 0; i < commentCount; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

      const comment = await prisma.comment.create({
        data: {
          content: `This is a great post! ${Math.random().toString(36).substring(7)}`,
          authorId: randomUser.id,
          postId: post.id,
        },
      });

      // Sometimes add replies
      if (Math.random() > 0.7) {
        const replyUser = allUsers[Math.floor(Math.random() * allUsers.length)];
        await prisma.comment.create({
          data: {
            content: `I agree with your comment! ${Math.random().toString(36).substring(7)}`,
            authorId: replyUser.id,
            postId: post.id,
            parentId: comment.id,
          },
        });
      }
    }
  }

  console.log('✅ Seed completed!');
  console.log(`Created ${allUsers.length} users`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${tags.length} tags`);
  console.log(`Created ${posts.length} posts`);

  console.log('\n📧 Test credentials:');
  console.log('Admin: admin@blog.com / admin123');
  console.log('Test User: test@blog.com / test123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

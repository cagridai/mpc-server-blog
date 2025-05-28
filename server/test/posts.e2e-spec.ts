import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  cleanDatabase,
  createTestApp,
  createTestUser,
  createTestCategory,
  createTestPost,
} from './utils/test-utils';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let user: any;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);

    // Create and login a test user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: 'Test User',
      });

    accessToken = registerResponse.body.access_token;
    user = registerResponse.body.user;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/posts (POST)', () => {
    it('should create a new post', async () => {
      const category = await createTestCategory(prisma);

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Post',
          content: 'This is a test post content.',
          excerpt: 'Test excerpt',
          published: true,
          categoryId: category.id,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('Test Post');
          expect(res.body.slug).toBe('test-post');
          expect(res.body.author.id).toBe(user.id);
          expect(res.body.category.id).toBe(category.id);
        });
    });

    it('should require authentication', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Test Post',
          content: 'This is a test post content.',
        })
        .expect(401);
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '', // empty title
          content: '', // empty content
        })
        .expect(400);
    });
  });

  describe('/posts (GET)', () => {
    beforeEach(async () => {
      // Create some test posts
      await createTestPost(prisma, user.id, {
        title: 'Published Post',
        slug: 'published-post',
        published: true,
      });

      await createTestPost(prisma, user.id, {
        title: 'Draft Post',
        slug: 'draft-post',
        published: false,
      });
    });

    it('should return published posts', () => {
      return request(app.getHttpServer())
        .get('/posts?published=true')
        .expect(200)
        .expect((res) => {
          expect(res.body.posts).toHaveLength(1);
          expect(res.body.posts[0].title).toBe('Published Post');
          expect(res.body.pagination).toBeDefined();
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/posts?page=1&limit=1')
        .expect(200)
        .expect((res) => {
          expect(res.body.posts).toHaveLength(1);
          expect(res.body.pagination.page).toBe(1);
          expect(res.body.pagination.limit).toBe(1);
        });
    });

    it('should support search', () => {
      return request(app.getHttpServer())
        .get('/posts?search=Published')
        .expect(200)
        .expect((res) => {
          expect(res.body.posts).toHaveLength(1);
          expect(res.body.posts[0].title).toBe('Published Post');
        });
    });
  });

  describe('/posts/:slug (GET)', () => {
    let post: any;

    beforeEach(async () => {
      post = await createTestPost(prisma, user.id, {
        title: 'Test Post Detail',
        slug: 'test-post-detail',
        published: true,
      });
    });

    it('should return post by slug', () => {
      return request(app.getHttpServer())
        .get('/posts/test-post-detail')
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Test Post Detail');
          expect(res.body.author).toBeDefined();
          expect(res.body.comments).toBeDefined();
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .get('/posts/non-existent-slug')
        .expect(404);
    });

    it('should increment views', async () => {
      // Get the post first time
      await request(app.getHttpServer())
        .get('/posts/test-post-detail')
        .expect(200);

      // Check views in database
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(updatedPost!.views).toBe(1);
    });
  });

  describe('/posts/:id (PATCH)', () => {
    let post: any;

    beforeEach(async () => {
      post = await createTestPost(prisma, user.id);
    });

    it('should update own post', () => {
      return request(app.getHttpServer())
        .patch(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Title');
          expect(res.body.content).toBe('Updated content');
          expect(res.body.slug).toBe('updated-title');
        });
    });

    it('should require authentication', () => {
      return request(app.getHttpServer())
        .patch(`/posts/${post.id}`)
        .send({
          title: 'Updated Title',
        })
        .expect(401);
    });

    it('should not allow updating other users posts', async () => {
      // Create another user
      const otherUser = await createTestUser(prisma, {
        email: 'other@example.com',
        username: 'otheruser',
      });

      const otherUserPost = await createTestPost(prisma, otherUser.id);

      return request(app.getHttpServer())
        .patch(`/posts/${otherUserPost.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Hacked Title',
        })
        .expect(403);
    });
  });

  describe('/posts/:id (DELETE)', () => {
    let post: any;

    beforeEach(async () => {
      post = await createTestPost(prisma, user.id);
    });

    it('should delete own post', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Post deleted successfully');
        });
    });

    it('should require authentication', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${post.id}`)
        .expect(401);
    });

    it('should not allow deleting other users posts', async () => {
      const otherUser = await createTestUser(prisma, {
        email: 'other@example.com',
        username: 'otheruser',
      });

      const otherUserPost = await createTestPost(prisma, otherUser.id);

      return request(app.getHttpServer())
        .delete(`/posts/${otherUserPost.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});

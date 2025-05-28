// src/comments/comments.service.ts (Enhanced)
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCommentDto,
  UpdateCommentDto,
  FindCommentsDto,
  ReplyToCommentDto,
} from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (createCommentDto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      if (parentComment.postId !== createCommentDto.postId) {
        throw new BadRequestException(
          'Parent comment does not belong to the specified post',
        );
      }
    }

    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async reply(userId: string, replyToCommentDto: ReplyToCommentDto) {
    const createCommentDto: CreateCommentDto = {
      content: replyToCommentDto.content,
      postId: replyToCommentDto.postId,
      parentId: replyToCommentDto.parentId,
    };

    return this.create(userId, createCommentDto);
  }

  async findAll(query: FindCommentsDto = {}) {
    const {
      page = 1,
      limit = 20,
      postId,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeReplies = false,
    } = query;

    const where: any = {};

    if (postId) where.postId = postId;
    if (authorId) where.authorId = authorId;
    if (!includeReplies) where.parentId = null;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          parent: includeReplies
            ? {
                select: {
                  id: true,
                  content: true,
                  author: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                    },
                  },
                },
              }
            : undefined,
          replies: !includeReplies
            ? {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      avatar: true,
                    },
                  },
                },
                orderBy: { createdAt: 'asc' },
              }
            : undefined,
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findByPost(postId: string, query: FindCommentsDto = {}) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.findAll({ ...query, postId });
  }

  async findByUser(userId: string, query: FindCommentsDto = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.findAll({ ...query, authorId: userId });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async findReplies(commentId: string, query: FindCommentsDto = {}) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = query;

    const [replies, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { parentId: commentId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where: { parentId: commentId } }),
    ]);

    return {
      replies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        replies: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // If comment has replies, we might want to soft delete or replace content
    if (comment.replies.length > 0) {
      // Option 1: Replace content with "[deleted]"
      await this.prisma.comment.update({
        where: { id },
        data: {
          content: '[This comment has been deleted]',
        },
      });

      return { message: 'Comment content deleted successfully' };
    } else {
      // Option 2: Hard delete if no replies
      await this.prisma.comment.delete({
        where: { id },
      });

      return { message: 'Comment deleted successfully' };
    }
  }
}

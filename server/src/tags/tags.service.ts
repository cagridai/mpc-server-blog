import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto, FindTagsDto } from './dto/tag.dto';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const slug = this.generateSlug(createTagDto.name);

    const existingTag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }

    return this.prisma.tag.create({
      data: {
        ...createTagDto,
        slug,
      },
    });
  }

  async findAll(query: FindTagsDto = {}) {
    const { search, sortBy = 'name', sortOrder = 'asc' } = query;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    let orderBy: any = {};

    switch (sortBy) {
      case 'postCount':
        orderBy = {
          posts: {
            _count: sortOrder,
          },
        };
        break;
      case 'createdAt':
        orderBy = { createdAt: sortOrder };
        break;
      default:
        orderBy = { name: sortOrder };
    }

    return this.prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy,
    });
  }

  async findPopular(limit: number = 10) {
    const data = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return { data };
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          where: { published: true },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
            category: true,
            _count: {
              select: { comments: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const slug = updateTagDto.name
      ? this.generateSlug(updateTagDto.name)
      : undefined;

    return this.prisma.tag.update({
      where: { id },
      data: {
        ...updateTagDto,
        ...(slug && { slug }),
      },
    });
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }

  private generateSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
    });
  }
}

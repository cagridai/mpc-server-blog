import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto, FindTagsDto } from './dto/tag.dto';
import { JwtGuard } from '../auth/guards/jwt.guards';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser() user: any, @Body() createTagDto: CreateTagDto) {
    // Only admins can create tags, or we can allow all authenticated users
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Query() query: FindTagsDto) {
    return this.tagsService.findAll(query);
  }

  @Get('popular')
  findPopular() {
    return this.tagsService.findPopular();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser() user: any,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    if (user.role !== Role.ADMIN) {
      throw new Error('Only admins can update tags');
    }
    return this.tagsService.update(id, updateTagDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    if (user.role !== Role.ADMIN) {
      throw new Error('Only admins can delete tags');
    }
    return this.tagsService.remove(id);
  }
}

// src/categories/categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtGuard } from '../auth/guards/jwt.guards';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser() user: any, @Body() createCategoryDto: CreateCategoryDto) {
    // Only admins can create categories
    if (user.role !== Role.ADMIN) {
      throw new Error('Only admins can create categories');
    }
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser() user: any,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    if (user.role !== Role.ADMIN) {
      throw new Error('Only admins can update categories');
    }
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    if (user.role !== Role.ADMIN) {
      throw new Error('Only admins can delete categories');
    }
    return this.categoriesService.remove(id);
  }
}

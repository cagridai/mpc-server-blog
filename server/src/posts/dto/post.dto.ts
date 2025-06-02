import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
}

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
}

export class FindPostsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  tagId?: string;

  @IsString()
  @IsOptional()
  authorId?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

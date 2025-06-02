import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  parentId?: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(1000)
  content?: string;
}

export class FindCommentsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  postId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  authorId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt';

  @ApiProperty()
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsOptional()
  includeReplies?: boolean;
}

export class ReplyToCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  parentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postId: string;
}

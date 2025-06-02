// src/tags/dto/tag.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9\s-_]+$/, {
    message:
      'Tag name can only contain letters, numbers, spaces, hyphens, and underscores',
  })
  name: string;
}

export class UpdateTagDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9\s-_]+$/, {
    message:
      'Tag name can only contain letters, numbers, spaces, hyphens, and underscores',
  })
  name?: string;
}

export class FindTagsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sortBy?: 'name' | 'postCount' | 'createdAt';

  @ApiProperty()
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}

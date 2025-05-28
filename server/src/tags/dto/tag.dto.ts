// src/tags/dto/tag.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateTagDto {
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
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'name' | 'postCount' | 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

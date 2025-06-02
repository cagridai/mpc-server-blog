import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

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
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

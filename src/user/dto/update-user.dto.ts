import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  role?: string;
}
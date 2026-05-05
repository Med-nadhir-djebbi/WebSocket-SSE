import { IsString, IsInt, IsOptional } from 'class-validator';
export class UpdateCvDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  firstname?: string;
  @IsInt()
  @IsOptional()
  age?: number;
  @IsString()
  @IsOptional()
  cin?: string;
  @IsString()
  @IsOptional()
  job?: string;
  @IsString()
  @IsOptional()
  path?: string;
}
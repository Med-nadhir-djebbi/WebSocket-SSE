import { IsString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  cin: string;

  @IsString()
  @IsNotEmpty()
  job: string;

  @IsString()
  @IsNotEmpty()
  path: string;
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  skills?: number[];
}
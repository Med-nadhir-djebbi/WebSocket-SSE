import { IsString, IsNotEmpty } from 'class-validator';
export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  designation: string;
}
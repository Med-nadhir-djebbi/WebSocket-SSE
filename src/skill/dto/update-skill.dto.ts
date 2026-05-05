import { IsString, IsOptional } from 'class-validator';
export class UpdateSkillDto {
    @IsString()
    @IsOptional()
    designation?: string;
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateDto } from './create-template.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TemplateCategory } from '../template-categories.enum';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @IsOptional()
  @IsEnum(TemplateCategory)
  category?: TemplateCategory;
}

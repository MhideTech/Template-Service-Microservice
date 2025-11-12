import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TemplateCategory } from '../template-categories.enum';
import { Transform } from 'class-transformer';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEnum(TemplateCategory, {
    message:
      'category must be a valid enum value (Email, Landing Page, Invoice, Portfolio, Blog, Other)',
  })
  category: TemplateCategory;
}

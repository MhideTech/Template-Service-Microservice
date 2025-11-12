import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateCategory } from './template-categories.enum';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const { title, content, category } = createTemplateDto;

    // ✅ Case-insensitive enum validation & normalization
    const normalizedCategory = this.normalizeCategory(category);

    // ✅ 100% safety fallback: throw error if invalid
    if (!Object.values(TemplateCategory).includes(normalizedCategory)) {
      throw new BadRequestException(
        `Invalid category '${category}'. Must be one of: ${Object.values(TemplateCategory).join(', ')}`,
      );
    }

    const template = this.templatesRepository.create({
      title,
      content,
      category: normalizedCategory,
    });

    return this.templatesRepository.save(template);
  }

  // 🔹 Helper function to normalize category case-insensitively
  private normalizeCategory(category: string): TemplateCategory {
    if (!category) return TemplateCategory.OTHER;

    // Find a match ignoring case
    const match = Object.values(TemplateCategory).find(
      (value: string) => value.toLowerCase() === category.toLowerCase(),
    );

    // If found, return the properly-cased enum value
    return match || (category as TemplateCategory);
  }

  async findAll(): Promise<Template[]> {
    return this.templatesRepository.find();
  }

  async findOne(id: number): Promise<Template> {
    const template = await this.templatesRepository.findOneBy({ id });
    if (!template) {
      throw new BadRequestException(`Template with ID ${id} not found.`);
    }
    return template;
  }

  async update(id: number, data: Partial<Template>): Promise<Template> {
    await this.templatesRepository.update(id, data);
    const updatedTemplate = await this.templatesRepository.findOneBy({ id });
    if (!updatedTemplate) {
      throw new BadRequestException(`Template with ID ${id} not found.`);
    }
    return updatedTemplate;
  }

  async remove(id: number): Promise<void> {
    await this.templatesRepository.delete(id);
  }
}

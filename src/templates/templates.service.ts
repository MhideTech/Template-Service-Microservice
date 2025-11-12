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

  // 🔹 Create Template
  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const { title, content, category } = createTemplateDto;

    // Validate content before anything else
    this.validateTemplateContent(content);

    // ✅ Case-insensitive enum validation & normalization
    const normalizedCategory = this.normalizeCategory(category);

    if (!Object.values(TemplateCategory).includes(normalizedCategory)) {
      throw new BadRequestException(
        `Invalid category '${category}'. Must be one of: ${Object.values(
          TemplateCategory,
        ).join(', ')}`,
      );
    }

    const template = this.templatesRepository.create({
      title,
      content,
      category: normalizedCategory,
    });

    return this.templatesRepository.save(template);
  }

  // 🔹 Normalize category case-insensitively
  private normalizeCategory(category: string): TemplateCategory {
    if (!category) return TemplateCategory.OTHER;

    const match = Object.values(TemplateCategory).find(
      (value: string) => value.toLowerCase() === category.toLowerCase(),
    );

    return match || (category as TemplateCategory);
  }

  // 🔹 Validate template structure before save/update
  private validateTemplateContent(content: string) {
    if (!content || content.trim() === '') {
      throw new BadRequestException('Template content cannot be empty.');
    }

    // Check invalid patterns like {{ | something }} or {{ name | }}
    const invalidPattern = /\{\{\s*\|\s*[^}]*\}\}/;
    if (invalidPattern.test(content)) {
      throw new BadRequestException('Invalid placeholder format detected.');
    }

    // Ensure all variable names are valid identifiers
    const placeholderRegex = /\{\{\s*([\w]+)(?:\s*\|\s*[^}]+)?\s*\}\}/g;
    let match;
    while ((match = placeholderRegex.exec(content)) !== null) {
      const variableName = match[1];
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(variableName)) {
        throw new BadRequestException(`Invalid variable name: ${variableName}`);
      }
    }
  }

  // 🔹 Extract all variable names from template content
  private extractVariables(content: string): string[] {
    const regex = /\{\{\s*([\w]+)(?:\s*\|\s*[^}]+)?\s*\}\}/g;
    const variables = new Set<string>();
    let match;
    while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
    }
    return Array.from(variables);
  }

  // 🔹 Find all templates
  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.templatesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 🔹 Find one template by ID
  async findOne(id: number): Promise<Template> {
    const template = await this.templatesRepository.findOneBy({ id });
    if (!template) {
      throw new BadRequestException(`Template with ID ${id} not found.`);
    }
    return template;
  }

  // 🔹 Render preview (with validation + variable extraction)
  async renderTemplate(
    id: number,
    variables: Record<string, any>,
  ): Promise<{ renderedContent: string; variables: string[] }> {
    const template = await this.templatesRepository.findOneBy({ id });
    if (!template) {
      throw new BadRequestException(`Template with id ${id} not found`);
    }

    // Validate structure before rendering
    this.validateTemplateContent(template.content);

    // Extract variables for feedback
    const detectedVariables = this.extractVariables(template.content);

    // Perform replacements
    let rendered = template.content;
    const regex = /\{\{\s*([\w.]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g;

    rendered = rendered.replace(
      regex,
      (_, key: string, defaultValue?: string) => {
        key = key.trim();
        const value: unknown = variables[key];

        if (value !== undefined && value !== null) {
          return String(value);
        }
        if (defaultValue) {
          return defaultValue.trim();
        }
        return '';
      },
    );

    return {
      renderedContent: rendered,
      variables: detectedVariables,
    };
  }

  // 🔹 Update existing template
  async update(id: number, data: Partial<Template>): Promise<Template> {
    if (data.content) {
      this.validateTemplateContent(data.content);
    }

    await this.templatesRepository.update(id, data);
    const updatedTemplate = await this.templatesRepository.findOneBy({ id });
    if (!updatedTemplate) {
      throw new BadRequestException(`Template with ID ${id} not found.`);
    }
    return updatedTemplate;
  }

  // 🔹 Delete template
  async remove(id: number): Promise<void> {
    await this.templatesRepository.delete(id);
  }
}

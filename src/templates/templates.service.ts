import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async create(data: Partial<Template>): Promise<Template> {
    const template = this.templateRepository.create(data);
    return await this.templateRepository.save(template);
  }

  async findAll(): Promise<Template[]> {
    return await this.templateRepository.find();
  }

  async findOne(id: number): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async update(id: number, data: Partial<Template>): Promise<Template> {
    await this.templateRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.templateRepository.delete(id);
  }

  // ✅ NEW: Render method
  async renderTemplate(id: number, variables: Record<string, string>) {
    const template = await this.findOne(id);

    const content = template.content;
    if (!content?.body || !content?.subject)
      throw new Error('Invalid template format');

    let renderedBody = content.body;
    let renderedSubject = content.subject;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      renderedBody = renderedBody.replace(regex, value);
      renderedSubject = renderedSubject.replace(regex, value);
    }

    return {
      subject: renderedSubject,
      body: renderedBody,
    };
  }
}

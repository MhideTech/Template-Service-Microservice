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

  async findAll(): Promise<Template[]> {
    return await this.templateRepository.find();
  }

  async findOne(id: number): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template)
      throw new NotFoundException(`Template with ID ${id} not found`);
    return template;
  }

  async create(data: Partial<Template>): Promise<Template> {
    const newTemplate = this.templateRepository.create(data);
    return await this.templateRepository.save(newTemplate);
  }

  async update(id: number, data: Partial<Template>): Promise<Template> {
    const template = await this.findOne(id);
    Object.assign(template, data);
    return await this.templateRepository.save(template);
  }

  async remove(id: number): Promise<void> {
    const template = await this.findOne(id);
    await this.templateRepository.remove(template);
  }
}

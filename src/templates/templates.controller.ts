import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Template } from './entities/template.entity';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async findAll() {
    const data = await this.templatesService.findAll();
    return { success: true, data, message: 'Templates fetched successfully' };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.templatesService.findOne(id);
    return { success: true, data, message: 'Template fetched successfully' };
  }

  @Post()
  async create(@Body() body: Partial<Template>) {
    const data = await this.templatesService.create(body);
    return { success: true, data, message: 'Template created successfully' };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: Partial<Template>) {
    const data = await this.templatesService.update(id, body);
    return { success: true, data, message: 'Template updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.templatesService.remove(id);
    return { success: true, message: 'Template deleted successfully' };
  }
}

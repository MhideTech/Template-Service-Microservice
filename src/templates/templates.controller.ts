import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Query } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  // 🟩 Create a template
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    try {
      const created = await this.templatesService.create(createTemplateDto);
      return {
        message: 'Template created successfully',
        data: created,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // 🟦 Get all templates
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.templatesService.findAll(Number(page), Number(limit));
  }

  // 🟨 Get one by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const template = await this.templatesService.findOne(id);
    return { data: template };
  }

  // 🟪 Render Preview (with variables)
  @Post(':id/preview')
  async preview(
    @Param('id') id: number,
    @Body() body: { variables: Record<string, any> },
  ) {
    try {
      const { variables } = body;
      if (!variables || typeof variables !== 'object') {
        throw new BadRequestException('Missing or invalid variables object.');
      }

      const result = await this.templatesService.renderTemplate(id, variables);
      return {
        message: 'Preview generated successfully',
        ...result, // includes renderedContent + variables
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // 🟧 Update template
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<CreateTemplateDto>,
  ) {
    try {
      const updated = await this.templatesService.update(id, data);
      return {
        message: 'Template updated successfully',
        data: updated,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // 🟥 Delete template
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.templatesService.remove(id);
    return { message: 'Template deleted successfully' };
  }
}

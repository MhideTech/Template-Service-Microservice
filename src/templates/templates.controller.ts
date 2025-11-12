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
import { RenderTemplateDto } from './dto/render-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.templatesService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.templatesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.templatesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.templatesService.remove(id);
  }

  @Post(':id/preview')
  async preview(@Param('id') id: number, @Body() data: RenderTemplateDto) {
    const renderedContent = await this.templatesService.renderTemplate(
      id,
      data.variables,
    );
    return { renderedContent };
  }

  // ✅ NEW: Render endpoint
  // @Post(':id/render')
  // renderTemplate(
  //   @Param('id') id: number,
  //   @Body() variables: Record<string, string>,
  // ) {
  //   return this.templatesService.renderTemplate(id, variables);
  // }
}

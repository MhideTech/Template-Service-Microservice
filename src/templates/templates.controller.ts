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

  // ✅ NEW: Render endpoint
  // @Post(':id/render')
  // renderTemplate(
  //   @Param('id') id: number,
  //   @Body() variables: Record<string, string>,
  // ) {
  //   return this.templatesService.renderTemplate(id, variables);
  // }
}

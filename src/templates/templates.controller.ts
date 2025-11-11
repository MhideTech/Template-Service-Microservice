import { Controller, Get } from '@nestjs/common';

@Controller('templates')
export class TemplatesController {
  @Get()
  findAll() {
    return {
      success: true,
      data: [],
      error: null,
      message: 'Templates fetched successfully',
      meta: {
        total: 0,
        limit: 10,
        page: 1,
        total_pages: 1,
        has_next: false,
        has_previous: false,
      },
    };
  }
}

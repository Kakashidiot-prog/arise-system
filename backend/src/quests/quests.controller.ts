import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('quests')
export class QuestsController {
  constructor(private questsService: QuestsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.questsService.findByCategory(category);
    }
    return this.questsService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.questsService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.questsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.questsService.delete(id);
  }
}
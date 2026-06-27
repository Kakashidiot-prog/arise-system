import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';

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
  create(@Body() dto: CreateQuestDto) {
    return this.questsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuestDto) {
    return this.questsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.questsService.delete(id);
  }
}
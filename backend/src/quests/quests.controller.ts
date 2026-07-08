import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';

@UseGuards(JwtAuthGuard)
@Controller('quests')
export class QuestsController {
  constructor(private questsService: QuestsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: number }, @Query('category') category?: string) {
    if (category) return this.questsService.findByCategory(user.id, category);
    return this.questsService.findAll(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateQuestDto) {
    return this.questsService.create(user.id, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuestDto) {
    return this.questsService.update(user.id, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    return this.questsService.delete(user.id, id);
  }
}
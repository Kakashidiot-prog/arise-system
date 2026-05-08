import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
}
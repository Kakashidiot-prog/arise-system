import { Controller, Post, Get, Body, UseGuards, Request, } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ToggleTaskDto } from './dto/toggle-task.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('toggle')
  toggleTask(@Request() req, @Body() dto: ToggleTaskDto) {
    return this.progressService.toggleTask(req.user.id, dto.taskId);
  }

  @Post('increment')
  incrementTask(@Request() req, @Body() dto: { taskId: number, amount: number }) {
    return this.progressService.incrementTask(req.user.id, dto.taskId, dto.amount);
  }

  @Get()
  getProgress(@Request() req) {
    return this.progressService.getUserProgress(req.user.id);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.progressService.getUserStats(req.user.id);
  }

  @Get('week-activity')
  getWeekActivity(@Request() req) {
    return this.progressService.getWeekActivity(req.user.id);
  }

  @Post('welcome')
  acceptWelcome(@CurrentUser() user: { id: number }) {
    return this.progressService.acceptWelcome(user.id);
  }
}
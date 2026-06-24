import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('toggle')
  toggleTask(@Request() req, @Body('taskId') taskId: number) {
    return this.progressService.toggleTask(req.user.id, taskId);
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
}
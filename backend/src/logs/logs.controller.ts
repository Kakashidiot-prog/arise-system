import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Post()
  create(@Request() req, @Body('text') text: string) {
    return this.logsService.create(req.user.id, text);
  }

  @Get()
  findAll(@Request() req) {
    return this.logsService.findAll(req.user.id);
  }
}

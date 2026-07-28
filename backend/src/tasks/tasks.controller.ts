import { Controller, Delete, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Delete(':id')
  delete(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(user.id, id);
  }

}

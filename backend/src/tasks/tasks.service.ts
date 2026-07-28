import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  async remove(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, quest: { userId } },
    });
    if (!task) throw new NotFoundException(`task #${id} not found`);

    return this.prisma.task.delete({ where: { id } });
  }
}

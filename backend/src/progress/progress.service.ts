import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async toggleTask(userId: number, taskId: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const existing = await this.prisma.progress.findUnique({
      where: { userId_taskId: { userId, taskId } },
    });

    if (existing) {
      await this.prisma.progress.delete({ where: { id: existing.id } });
      await this.updateUserExp(userId, -task.exp);
      return { completed: false };
    } else {
      await this.prisma.progress.create({
        data: { userId, taskId, completed: true },
      });
      await this.updateUserExp(userId, task.exp);
      return { completed: true };
    }
  }

  private async updateUserExp(userId: number, expDelta: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    let newExp = user.exp + expDelta;
    if (newExp < 0) newExp = 0;
    const newLevel = Math.floor(newExp / 5) + 1;

    await this.prisma.user.update({
      where: { id: userId },
      data: { exp: newExp, level: newLevel },
    });
  }

  async getUserProgress(userId: number) {
    return this.prisma.progress.findMany({
      where: { userId },
      select: { taskId: true },
    });
  }

  async getUserStats(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { exp: true, level: true, streak: true, username: true },
    });
  }
}
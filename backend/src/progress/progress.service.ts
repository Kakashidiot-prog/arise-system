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

      // Create a log entry for the action
      await this.prisma.log.create({
        data: {
          userId,
          text: `Unchecked: ${task.name} (-${task.exp} EXP)`,
        },
      });

      return { completed: false };
    } else {
      await this.prisma.progress.create({
        data: { userId, taskId, completed: true },
      });
      await this.updateUserExp(userId, task.exp);
      await this.updateStreak(userId);

      // Create a log entry for the action
      await this.prisma.log.create({
        data: {
          userId,
          text: `Completed: ${task.name} (+${task.exp} EXP)`,
        },
      });

      return { completed: true };
    }
  }

  private async updateStreak(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    if (user.lastActiveDate === today) return;

    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = yesterdayObj.toISOString().slice(0, 10);

    let newStreak = user.streak;
    if (user.lastActiveDate === yesterday) {
      newStreak = (newStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        lastActiveDate: today,
      },
    });
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

  async getWeekActivity(userId: number) {
    const activityMap: Record<string, boolean> = {};
    const dates: string[] = [];

    // Generate last 7 days (including today)
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dates.push(dateStr);
      activityMap[dateStr] = false;
    }

    // Fetch user logs from the last 7 days
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 7);
    minDate.setHours(0, 0, 0, 0);

    const logs = await this.prisma.log.findMany({
      where: {
        userId,
        createdAt: { gte: minDate },
      },
      select: { createdAt: true },
    });

    for (const log of logs) {
      const dateStr = log.createdAt.toISOString().slice(0, 10);
      if (activityMap[dateStr] !== undefined) {
        activityMap[dateStr] = true;
      }
    }

    // Fallback/Ensure user's lastActiveDate is reflected
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastActiveDate: true },
    });
    if (user?.lastActiveDate && activityMap[user.lastActiveDate] !== undefined) {
      activityMap[user.lastActiveDate] = true;
    }

    return activityMap;
  }
}
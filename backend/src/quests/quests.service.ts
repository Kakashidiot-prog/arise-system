import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UpdateTaskDto } from '../quests/dto/update-task.dto';

@Injectable()
export class QuestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.quest.findMany({
      where: { userId },
      include: { tasks: true },
      orderBy: { order: 'asc' },
    });
  }

  async findByCategory(userId: number, category: string) {
    return this.prisma.quest.findMany({
      where: { userId, category },
      include: { tasks: true },
      orderBy: { order: 'asc' },
    });
  }

  async create(userId: number, dto: CreateQuestDto) {
    return this.prisma.quest.create({
      data: {
        key: dto.key,
        name: dto.name,
        icon: dto.icon,
        sub: dto.sub,
        category: dto.category,
        order: dto.order,
        userId,
        tasks: dto.tasks
          ? { create: dto.tasks.map((t) => ({ key: t.key, name: t.name, note: t.note, exp: t.exp })) }
          : undefined,
      },
      include: { tasks: true },
    });
  }

  async update(userId: number, id: number, dto: UpdateQuestDto) {
    const quest = await this.prisma.quest.findUnique({ where: { id } });
    if (!quest) throw new NotFoundException(`Quest #${id} not found`);
    if (quest.userId !== userId) throw new ForbiddenException();

    return this.prisma.quest.update({
      where: { id },
      data: dto,
      include: { tasks: true },
    });
  }

  async taskUpdate(userId: number, id: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: { id, quest: { userId } },
    });
    if (!task) throw new NotFoundException(`Task #${id} not found`);

    return this.prisma.task.update({
      where: { id },
      data: dto,
      include: { quest: true },
    });
  }

  async delete(userId: number, id: number) {
    const quest = await this.prisma.quest.findUnique({ where: { id } });
    if (!quest) throw new NotFoundException(`Quest #${id} not found`);
    if (quest.userId !== userId) throw new ForbiddenException();

    return this.prisma.quest.delete({ where: { id } });
  }
}
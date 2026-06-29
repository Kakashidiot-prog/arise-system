import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';

@Injectable()
export class QuestsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.quest.findMany({
      include: { tasks: true },
      orderBy: { order: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.quest.findMany({
      where: { category },
      include: { tasks: true },
      orderBy: { order: 'asc' },
    });
  }

  async create(dto: CreateQuestDto) {
    return this.prisma.quest.create({
      data: {
        key: dto.key,
        name: dto.name,
        icon: dto.icon,
        sub: dto.sub,
        category: dto.category,
        order: dto.order,
        tasks: dto.tasks
          ? {
            create: dto.tasks.map((t) => ({
              key: t.key,
              name: t.name,
              note: t.note,
              exp: t.exp,
            })),
          }
          : undefined,
      },
      include: { tasks: true },
    });
  }

  async update(id: number, dto: UpdateQuestDto) {
    const quest = await this.prisma.quest.findUnique({ where: { id } });
    if (!quest) throw new NotFoundException(`Quest #${id} not found`);

    return this.prisma.quest.update({
      where: { id },
      data: dto,
      include: { tasks: true },
    });
  }

  async delete(id: number) {
    const quest = await this.prisma.quest.findUnique({ where: { id } });
    if (!quest) throw new NotFoundException(`Quest #${id} not found`);

    return this.prisma.quest.delete({
      where: { id },
    });
  }
}
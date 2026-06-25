import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestsService {
  constructor(private prisma: PrismaService) { }

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

  async create(data: {
    key: string;
    name: string;
    icon: string;
    sub: string;
    category: string;
    order: number;
    tasks?: { key: string; name: string; note?: string; exp: number }[];
  }) {
    return this.prisma.quest.create({
      data: {
        key: data.key,
        name: data.name,
        icon: data.icon,
        sub: data.sub,
        category: data.category,
        order: data.order,
        tasks: data.tasks ? {
          create: data.tasks.map(t => ({
            key: t.key,
            name: t.name,
            note: t.note,
            exp: t.exp,
          }))
        } : undefined,
      },
      include: { tasks: true },
    });
  }
  
  async update(id: number, data: {
    name?: string;
    icon?: string;
    sub?: string;
    category?: string;
    order?: number;
  }) {
    return this.prisma.quest.update({
      where: { id },
      data,
      include: { tasks: true },
    });
  }

  async delete(id: number) {
    return this.prisma.quest.delete({
      where: { id },
    });
  }
}
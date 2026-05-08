import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
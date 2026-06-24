import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, text: string) {
    const log = await this.prisma.log.create({
      data: {
        userId,
        text,
      },
    });

    // Enforce max 30 entries by deleting older logs
    const count = await this.prisma.log.count({ where: { userId } });
    if (count > 30) {
      const oldestToKeep = await this.prisma.log.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 29,
        take: 1,
      });

      if (oldestToKeep.length > 0) {
        await this.prisma.log.deleteMany({
          where: {
            userId,
            createdAt: { lt: oldestToKeep[0].createdAt },
          },
        });
      }
    }

    return log;
  }

  async findAll(userId: number) {
    return this.prisma.log.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }
}

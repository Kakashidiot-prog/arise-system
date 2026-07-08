import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { STARTER_QUESTS } from './starter-quests';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const exists = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new ConflictException('Username already taken');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { username: dto.username, password: hash },
      });

      for (const quest of STARTER_QUESTS) {
        await tx.quest.create({
          data: {
            key: quest.key,
            name: quest.name,
            icon: quest.icon,
            sub: quest.sub,
            category: quest.category,
            order: quest.order,
            userId: newUser.id,
            tasks: {
              create: quest.tasks.map((t) => ({
                key: t.key,
                name: t.name,
                note: t.note,
                exp: t.exp,
              })),
            },
          },
        });
      }

      return newUser;
    });

    return this.signToken(user.id, user.username);
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.username);
  }

  private signToken(userId: number, username: string) {
    return {
      access_token: this.jwt.sign({ sub: userId, username }),
    };
  }
}
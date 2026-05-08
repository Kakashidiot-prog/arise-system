import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestsModule } from './quests/quests.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [PrismaModule, AuthModule, QuestsModule, ProgressModule],
})
export class AppModule {}
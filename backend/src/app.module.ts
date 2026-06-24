import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestsModule } from './quests/quests.module';
import { ProgressModule } from './progress/progress.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [PrismaModule, AuthModule, QuestsModule, ProgressModule, LogsModule],
})
export class AppModule {}
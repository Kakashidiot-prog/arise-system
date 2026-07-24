import { Module } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';

import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [ProgressModule],
  providers: [QuestsService],
  controllers: [QuestsController],
})
export class QuestsModule {}
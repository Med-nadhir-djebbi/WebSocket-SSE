import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { CvHistory } from './entities/cv-history.entity';
import { CvHistoryListener } from './listeners/cv-history.listener';
import { CvWebhookListener } from './listeners/cv-webhook.listener';
@Module({
  imports: [TypeOrmModule.forFeature([Cv, CvHistory])],
  controllers: [CvController],
  providers: [CvService, CvHistoryListener, CvWebhookListener],
})
export class CvModule {}
import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { SseListener } from './sse.listener';

@Module({
  controllers: [SseController],
  providers: [SseService, SseListener],
})
export class SseModule {}

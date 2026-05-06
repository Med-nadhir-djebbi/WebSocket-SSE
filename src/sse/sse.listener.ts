import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SseService } from './sse.service';

type CvEventPayload = {
  userId?: number;
  cvId?: number;
  date: Date;
  action?: string;
  actorType?: string;
  source?: string;
};

@Injectable()
export class SseListener {
  constructor(private readonly sseService: SseService) {}

  @OnEvent('cv.created')
  onCreated(payload: CvEventPayload) {
    this.sseService.push(payload.userId ?? null, { event: 'cv.created', ...payload });
  }

  @OnEvent('cv.updated')
  onUpdated(payload: CvEventPayload) {
    this.sseService.push(payload.userId ?? null, { event: 'cv.updated', ...payload });
  }

  @OnEvent('cv.deleted')
  onDeleted(payload: CvEventPayload) {
    this.sseService.push(payload.userId ?? null, { event: 'cv.deleted', ...payload });
  }

  @OnEvent('cv.accessed')
  onAccessed(payload: CvEventPayload) {
    this.sseService.push(payload.userId ?? null, { event: 'cv.accessed', ...payload });
  }
}

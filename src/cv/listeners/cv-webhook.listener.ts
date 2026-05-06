import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

type CvCreatedPayload = {
  cvId?: number;
  userId?: number;
  date: Date;
  actorType?: 'user' | 'system' | 'service' | 'job';
  actorId?: string;
  source?: 'http' | 'service' | 'job' | 'queue' | 'cli';
};

@Injectable()
export class CvWebhookListener {
  private readonly logger = new Logger(CvWebhookListener.name);

  @OnEvent('cv.created')
  async handleCvCreated(payload: CvCreatedPayload): Promise<void> {
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.debug('WEBHOOK_URL is not configured. Skipping webhook.');
      return;
    }

    const webhookPayload = {
      event: 'cv.created',
      cvId: payload.cvId ?? null,
      userId: payload.userId ?? null,
      actorType: payload.actorType ?? null,
      actorId: payload.actorId ?? null,
      source: payload.source ?? null,
      occurredAt: payload.date,
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        this.logger.warn(
          `Webhook failed with status ${response.status} for event cv.created`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Webhook call failed: ${message}`);
    }
  }
}

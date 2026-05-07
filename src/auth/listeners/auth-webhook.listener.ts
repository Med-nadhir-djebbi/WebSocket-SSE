import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

type UserRegisteredPayload = {
  userId: number;
  username: string;
  email: string;
  role: string;
  date: Date;
  source?: 'http' | 'service' | 'job' | 'queue' | 'cli';
};

@Injectable()
export class AuthWebhookListener {
  private readonly logger = new Logger(AuthWebhookListener.name);

  @OnEvent('user.registered')
  async handleUserRegistered(payload: UserRegisteredPayload): Promise<void> {
    const webhookUrl = process.env.USER_WEBHOOK_URL || process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.debug('No USER_WEBHOOK_URL/WEBHOOK_URL configured. Skipping webhook.');
      return;
    }

    const webhookPayload = {
      event: 'user.registered',
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role,
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
        this.logger.warn(`Webhook failed with status ${response.status} for event user.registered`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Webhook call failed: ${message}`);
    }
  }
}

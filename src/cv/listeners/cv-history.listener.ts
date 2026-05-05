import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvHistory } from '../entities/cv-history.entity';

type CvEventPayload = {
	userId?: number;
	date: Date;
	action?: string;
	cvId?: number;
	actorType?: 'user' | 'system' | 'service' | 'job';
	actorId?: string;
	source?: 'http' | 'service' | 'job' | 'queue' | 'cli';
};

@Injectable()
export class CvHistoryListener {
	constructor(
		@InjectRepository(CvHistory)
		private readonly cvHistoryRepository: Repository<CvHistory>,
	) {}

	@OnEvent('cv.created')
	async handleCvCreated(payload: CvEventPayload): Promise<void> {
		await this.saveHistory('cv.created', payload);
	}

	@OnEvent('cv.updated')
	async handleCvUpdated(payload: CvEventPayload): Promise<void> {
		await this.saveHistory('cv.updated', payload);
	}

	@OnEvent('cv.deleted')
	async handleCvDeleted(payload: CvEventPayload): Promise<void> {
		await this.saveHistory('cv.deleted', payload);
	}

	@OnEvent('cv.accessed')
	async handleCvAccessed(payload: CvEventPayload): Promise<void> {
		await this.saveHistory('cv.accessed', payload);
	}

	private async saveHistory(event: string, payload: CvEventPayload): Promise<void> {
		const actorType = payload.actorType ?? (payload.userId ? 'user' : 'system');
		const entry = this.cvHistoryRepository.create({
			event,
			action: payload.action ?? null,
			cvId: payload.cvId ?? null,
			userId: payload.userId ?? null,
			actorType,
			actorId: payload.actorId ?? (payload.userId ? String(payload.userId) : null),
			source: payload.source ?? 'service',
			eventDate: payload.date,
		});

		await this.cvHistoryRepository.save(entry);
	}
}

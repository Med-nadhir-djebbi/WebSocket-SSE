import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MessageEvent } from '@nestjs/common';

type SseEvent = {
  userId: number | null;
  data: Record<string, unknown>;
};

@Injectable()
export class SseService {
  private readonly bus = new Subject<SseEvent>();

  push(userId: number | null, data: Record<string, unknown>): void {
    this.bus.next({ userId, data });
  }

  stream(userId: number, role: string): Observable<MessageEvent> {
    const isAdmin = role === 'admin';
    return this.bus.asObservable().pipe(
      filter((e) => isAdmin || e.userId === userId),
      map((e) => ({ data: e.data }) as MessageEvent),
    );
  }
}

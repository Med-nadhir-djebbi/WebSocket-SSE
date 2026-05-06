import { Controller, Get, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { getUser } from '../auth/decorators/getUser.decorator';

@Controller('sse')
@UseGuards(AuthGuard('jwt'))
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('cvs')
  streamCvEvents(
    @getUser('id') userId: number,
    @getUser('role') role: string,
  ): Observable<MessageEvent> {
    return this.sseService.stream(userId, role);
  }
}

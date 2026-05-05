import { 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

type CvActorContext = {
  userId: number | null;
  actorType: 'user' | 'system';
  source: 'http' | 'service';
  actorId: string | null;
};

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createCvDto: CreateCvDto, userId?: number): Promise<Cv> {
    const { skills, ...cvData } = createCvDto;
    const actor = this.getActorContext(userId);
    const cv = this.cvRepository.create({
      ...cvData,
      ...(actor.userId ? { user: { id: actor.userId } } : {}),
    });
    const ret = await this.cvRepository.save(cv);
    if (ret) {
      this.eventEmitter.emit('cv.created', {
        userId: actor.userId ?? undefined,
        actorType: actor.actorType,
        actorId: actor.actorId ?? undefined,
        source: actor.source,
        date: new Date(),
        cvId: ret.id,
      });
    }
    return ret;
  }

  async findAll(userId?: number): Promise<Cv[]> {
    const cv = await this.cvRepository.find({ relations: ['user', 'skills'] });
    if (cv.length > 0) {
      const actor = this.getActorContext(userId);
      this.eventEmitter.emit('cv.accessed', {
        userId: actor.userId ?? undefined,
        actorType: actor.actorType,
        actorId: actor.actorId ?? undefined,
        source: actor.source,
        date: new Date(),
        action: 'findAll',
      });
    }
    return cv;
  }

  async findAllByUser(userId?: number): Promise<Cv[]> {
    if (!userId) {
      return this.findAll();
    }

    const ret = await this.cvRepository.find({ 
      where: { user: { id: userId } },
      relations: ['user', 'skills'] 
    });
    if (ret.length > 0) {
      const actor = this.getActorContext(userId);
      this.eventEmitter.emit('cv.accessed', {
        userId: actor.userId ?? undefined,
        actorType: actor.actorType,
        actorId: actor.actorId ?? undefined,
        source: actor.source,
        date: new Date(),
        action: 'findAllByUser',
      });
    }
    return ret;
  }

  async findOne(id: number, userId?: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'skills'] 
    });
    if (!cv) throw new NotFoundException(`CV with ID ${id} not found`);
    if (userId) {
      const actor = this.getActorContext(userId);
      this.eventEmitter.emit('cv.accessed', {
        userId: actor.userId ?? undefined,
        actorType: actor.actorType,
        actorId: actor.actorId ?? undefined,
        source: actor.source,
        date: new Date(),
        action: 'findOne',
        cvId: id,
      });
    }
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto, userId?: number): Promise<Cv> {
    const cv = userId ? await this.findOneByIdAndUser(id, userId) : await this.findOne(id);
    Object.assign(cv, updateCvDto);
    await this.cvRepository.save(cv);
    const actor = this.getActorContext(userId);
    this.eventEmitter.emit('cv.updated', {
      userId: actor.userId ?? undefined,
      actorType: actor.actorType,
      actorId: actor.actorId ?? undefined,
      source: actor.source,
      date: new Date(),
      cvId: id,
    });
    return this.findOne(id);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const cv = userId ? await this.findOneByIdAndUser(id, userId) : await this.findOne(id);
    await this.cvRepository.remove(cv);
    const actor = this.getActorContext(userId);
    this.eventEmitter.emit('cv.deleted', {
      userId: actor.userId ?? undefined,
      actorType: actor.actorType,
      actorId: actor.actorId ?? undefined,
      source: actor.source,
      date: new Date(),
      cvId: id,
    });
  }

  private async findOneByIdAndUser(id: number, userId: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'skills'],
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
    const actor = this.getActorContext(userId);
    this.eventEmitter.emit('cv.accessed', {
      userId: actor.userId ?? undefined,
      actorType: actor.actorType,
      actorId: actor.actorId ?? undefined,
      source: actor.source,
      date: new Date(),
      action: 'findOneByIdAndUser',
      cvId: id,
    });
    return cv;
  }

  private getActorContext(userId?: number): CvActorContext {
    if (userId) {
      return {
        userId,
        actorType: 'user',
        source: 'http',
        actorId: String(userId),
      };
    }

    return {
      userId: null,
      actorType: 'system',
      source: 'service',
      actorId: null,
    };
  }
}

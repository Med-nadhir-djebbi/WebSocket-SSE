import { 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}

  async create(createCvDto: CreateCvDto, userId: number): Promise<Cv> {
    const { skills, ...cvData } = createCvDto;
    const cv = this.cvRepository.create({
      ...cvData,
      user: { id: userId },
    });
    return this.cvRepository.save(cv);
  }

  async findAll(): Promise<Cv[]> {
    return this.cvRepository.find({ relations: ['user', 'skills'] });
  }

  async findAllByUser(userId: number): Promise<Cv[]> {
    return this.cvRepository.find({ 
      where: { user: { id: userId } },
      relations: ['user', 'skills'] 
    });
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'skills'] 
    });
    if (!cv) throw new NotFoundException(`CV with ID ${id} not found`);
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto, userId: number): Promise<Cv> {
    const cv = await this.findOneByIdAndUser(id, userId);
    Object.assign(cv, updateCvDto);
    await this.cvRepository.save(cv);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const cv = await this.findOneByIdAndUser(id, userId);
    await this.cvRepository.remove(cv);
  }

  private async findOneByIdAndUser(id: number, userId: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'skills'],
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    return cv;
  }
}

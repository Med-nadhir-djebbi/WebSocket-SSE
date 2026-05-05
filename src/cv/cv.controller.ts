import { Controller, Post, Get, Body, Req, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

type AuthenticatedRequest = Request & { user: { id: number } };

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    const { id: userId } = (req as AuthenticatedRequest).user;
    return this.cvService.create(createCvDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.cvService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) 
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @Req() req: Request) {
    const { id: userId } = (req as AuthenticatedRequest).user;
    return this.cvService.update(+id, updateCvDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  remove(@Param('id') id: string, @Req() req: Request) {
    const { id: userId } = (req as AuthenticatedRequest).user;
    return this.cvService.remove(+id, userId);
  }
}
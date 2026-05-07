import { Controller, Post, Get, Body, Req, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { getUser } from '../auth/decorators/getUser.decorator';
type AuthenticatedRequest = Request & { user: { id: number } };

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  create(@Body() createCvDto: CreateCvDto, @getUser('id') userId: number) {
    return this.cvService.create(createCvDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@getUser('id') userId: number) {
    return this.cvService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @getUser('id') userId: number) {
    return this.cvService.findOne(+id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) 
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @getUser('id') userId: number) {
    return this.cvService.update(+id, updateCvDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  remove(@Param('id') id: string, @getUser('id') userId: number) {
    return this.cvService.remove(+id, userId);
  }
}
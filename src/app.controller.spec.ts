import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { SkillModule } from './skill/skill.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cv-manager.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    CvModule,
    SkillModule,
  ],
})
export class AppModule {}
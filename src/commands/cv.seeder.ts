import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { UserService } from '../user/user.service';
import { randFullName, randEmail, randJobTitle } from '@ngneat/falso';

async function bootstrap(){
  const app=await NestFactory.createApplicationContext(AppModule);

  const cvService=app.get(CvService);
  const userService=app.get(UserService);

  const users:any[]=[];
  for(let i=0;i<5;i++){
    const user=await userService.create({
      username:randFullName(),
      email:randEmail(),
      password:'123456',
      role:i===0?'admin':'user'
    });
    users.push(user);
  }

  for(let i=0;i<20;i++){
    const randomUser=users[Math.floor(Math.random()*users.length)];

    await cvService.create({
      name:randFullName(),
      firstname:randFullName(),
      age:Math.floor(Math.random()*50)+18,
      cin:Math.floor(Math.random()*10000000).toString(),
      job:randJobTitle(),
      path:'/cv/path'
    }, randomUser.id);
  }

  console.log('Seeding done');

  await app.close();
}

bootstrap();
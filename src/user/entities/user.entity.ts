import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  username!: string;
  @Column()
  password!: string;
  @Column({ unique: true })
  email!: string;
  @Column({ default: 'user' })
  role!: string;
  @OneToMany(() => Cv, (cv) => cv.user)
  cvs!: Cv[];
}
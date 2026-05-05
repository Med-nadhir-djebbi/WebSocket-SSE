import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';
@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  firstname!: string;
  @Column()
  age!: number;
  @Column({ unique: true })
  cin!: string;
  @Column()
  job!: string;
  @Column()
  path!: string;
  @ManyToOne(() => User, (user) => user.cvs, { nullable: true })
  @JoinColumn()
  user!: User | null;
  @ManyToMany(() => Skill, (skill) => skill.cvs, { cascade: true })
  @JoinTable()
  skills!: Skill[];
}
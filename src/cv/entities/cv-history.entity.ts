import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cv_history')
export class CvHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  event!: string;

  @Column({ nullable: true })
  action!: string | null;

  @Column({ nullable: true })
  cvId!: number | null;

  @Column({ nullable: true })
  userId!: number | null;

  @Column({ default: 'system' })
  actorType!: string;

  @Column({ nullable: true })
  actorId!: string | null;

  @Column({ default: 'service' })
  source!: string;

  @Column({ type: 'datetime' })
  eventDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

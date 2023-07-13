import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/domain/entity/user.entity';
import { v4 as uuid } from 'uuid';
import { Answer } from './answers.entity';

@Entity('Player')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Answer, (a) => a.player, { cascade: true, eager: true })
  answers: Answer[];

  constructor(userId: string) {
    this.id = uuid();
    this.userId = userId;
  }
}

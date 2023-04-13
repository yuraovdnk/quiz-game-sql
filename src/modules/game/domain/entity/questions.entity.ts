import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  published: false;

  @UpdateDateColumn()
  updatedAt: Date;

  private constructor() {}

  static create() {}
}

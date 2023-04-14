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

  @Column({
    type: 'character varying',
    array: true,
    nullable: false,
  })
  correctAnswers: string[];

  @Column('boolean')
  published = false;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  private constructor() {}

  static create(body: string, answers: string[]) {
    const question = new Question();
    question.body = body;
    question.correctAnswers = answers;
    return question;
  }
}

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Game } from './game.entity';
import { Question } from './questions.entity';

@Entity('Answers')
export class Answer {
  @PrimaryColumn('uuid')
  gameId: string;

  @PrimaryColumn('uuid')
  questionId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('character varying')
  answerStatus: string;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => Question)
  question: Question;

  constructor(
    userId: string,
    gameId: string,
    questionId: string,
    answerStatus: string,
  ) {
    this.userId = userId;
    this.gameId = gameId;
    this.questionId = questionId;
    this.userId = userId;
    this.answerStatus = answerStatus;
  }
}

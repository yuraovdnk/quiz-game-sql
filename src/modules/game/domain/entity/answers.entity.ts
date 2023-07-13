import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Game } from './game.entity';
import { Question } from './questions.entity';
import { Player } from './player.entity';

@Entity('Answers')
export class Answer {
  @PrimaryColumn('uuid')
  questionId: string;

  @PrimaryColumn('uuid')
  playerId: string;

  @Column('character varying')
  answerStatus: string;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @ManyToOne(() => Player)
  player: Player;

  @ManyToOne(() => Question)
  question: Question;

  constructor(questionId: string, answerStatus: string) {
    this.questionId = questionId;
    this.answerStatus = answerStatus;
  }
}

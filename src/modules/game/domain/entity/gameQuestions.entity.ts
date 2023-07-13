import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';
import { Question } from './questions.entity';

@Entity('GameQuestions')
export class GameQuestions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  gameId: string;

  @Column('uuid')
  questionId: string;

  @Column('integer')
  orderInGame: number;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => Question, { eager: true })
  question: Question;

  constructor(gameId: string, questionId: string, order: number) {
    this.gameId = gameId;
    this.questionId = questionId;
    this.orderInGame = order;
  }
}

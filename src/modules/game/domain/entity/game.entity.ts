import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './questions.entity';
import { AnswerStatus, GameStatus } from '../../application/types/game.types';
import { GameQuestions } from './gameQuestions.entity';
import { Answer } from './answers.entity';
import { log } from 'util';
import { ForbiddenException } from '@nestjs/common';
import { User } from '../../../users/domain/entity/user.entity';

@Entity('Game')
export class Game {
  private constructor() {}

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  firstPlayerId: string;

  @Column('uuid', { nullable: true })
  secondPlayerId: string;

  @Column('timestamp with time zone', { default: null })
  startGameDate: Date;

  @Column('timestamp with time zone', { default: null })
  finishGameDate: Date;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  pairCreatedDate;

  @Column('varchar')
  status: string;

  @OneToMany(() => GameQuestions, (q) => q.game, { cascade: true })
  gameQuestions: GameQuestions[];

  @ManyToOne(() => User, (user) => user.id)
  firstPlayer: User;

  @ManyToOne(() => User, (user) => user.id)
  secondPlayer: User;

  @OneToMany(() => Answer, (a) => a.game, { cascade: true })
  answers: Answer[];

  static create(userId: string) {
    const game = new Game();
    game.firstPlayerId = userId;
    game.status = GameStatus.PendingSecondPlayer;
    return game;
  }

  startGame(userId: string, questions: Question[]) {
    this.secondPlayerId = userId;
    this.startGameDate = new Date(Date.now());
    this.status = GameStatus.Active;

    let orderNumber = 0;
    this.gameQuestions = questions.map(
      (question) => new GameQuestions(this.id, question.id, ++orderNumber),
    );
  }

  sendAnswer(answer: string, userId: string) {
    const userAnswers = this.answers.filter((item) => item.userId === userId);

    if (userAnswers.length === this.gameQuestions.length) {
      throw new ForbiddenException(); ///TODO?
    }

    const currentQuestion = this.gameQuestions.find(
      (i) => i.orderInGame === userAnswers.length + 1,
    );

    const answerStatus = currentQuestion.question.correctAnswers.includes(answer)
      ? AnswerStatus.Correct
      : AnswerStatus.Incorrect;

    this.answers.push(
      new Answer(userId, this.id, currentQuestion.questionId, answerStatus),
    );

    this.checkIsFinish();
  }
  private checkIsFinish() {
    if (this.gameQuestions.length * 2 === this.answers.length) {
      this.status = GameStatus.Finished;
      this.finishGameDate = new Date(Date.now());
    }
  }
}

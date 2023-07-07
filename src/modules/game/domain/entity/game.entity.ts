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
import { ForbiddenException } from '@nestjs/common';
import { User } from '../../../users/domain/entity/user.entity';
import { GameScore } from './gameScores.entity';

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

  @ManyToOne(() => User, (user) => user.id)
  firstPlayer: User;

  @ManyToOne(() => User, (user) => user.id)
  secondPlayer: User;

  @OneToMany(() => GameQuestions, (q) => q.game, { cascade: true })
  gameQuestions: GameQuestions[];

  @OneToMany(() => Answer, (a) => a.game, { cascade: true })
  answers: Answer[];

  @OneToMany(() => GameScore, (score) => score.game)
  gameScore: GameScore;

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
    const [currentUserAnswers, opponentAnswers] = this.answers.reduce(
      ([userAcc, opponentAcc], item) => {
        if (item.userId === userId) {
          return [[...userAcc, item], opponentAcc];
        }
        return [userAcc, [...opponentAcc, item]];
      },
      [[], []],
    );

    if (currentUserAnswers.length === this.gameQuestions.length) {
      throw new ForbiddenException(); ///TODO?
    }

    const currentQuestion = this.gameQuestions.find(
      (i) => i.orderInGame === currentUserAnswers.length + 1,
    );

    const answerStatus = currentQuestion.question.correctAnswers.includes(answer)
      ? AnswerStatus.Correct
      : AnswerStatus.Incorrect;

    this.answers.push(
      new Answer(userId, this.id, currentQuestion.questionId, answerStatus),
    );

    // if (this.answers.length === this.gameQuestions.length * 2) {
    //   this.status = GameStatus.Finished;
    //   this.finishGameDate = new Date(Date.now());
    //   const scoresPlayers = this.calcScores(currentUserAnswers, opponentAnswers);
    //   const scoreFirstUser = new GameScore(
    //     userId,
    //     this.id,
    //     scoresPlayers.scoreCurrentUser,
    //   );
    //   const scoreSecondUser = new GameScore(
    //     userId,
    //     this.id,
    //     scoresPlayers.scoreOpponent,
    //   );
    // }
  }

  private calcCorrectAnswers(answers: Answer[]): number {
    return answers.reduce((score, item) => {
      return item.answerStatus === AnswerStatus.Correct ? score++ : score;
    }, 0);
  }
}

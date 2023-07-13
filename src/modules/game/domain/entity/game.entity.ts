import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './questions.entity';
import { AnswerStatus, GameStatus } from '../../application/types/game.types';
import { GameQuestions } from './gameQuestions.entity';
import { Answer } from './answers.entity';
import { v4 as uuid } from 'uuid';
import { Player } from './player.entity';
import { ForbiddenException } from '@nestjs/common';

@Entity('Game')
export class Game {
  private constructor() {}
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
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
  status: string; //ENUM

  @OneToOne(() => Player, { cascade: true })
  @JoinColumn()
  firstPlayer: Player;

  @OneToOne(() => Player, { cascade: true })
  @JoinColumn()
  secondPlayer: Player;

  @OneToMany(() => GameQuestions, (q) => q.game, { cascade: true })
  gameQuestions: GameQuestions[];

  private currentPlayer(playerId: string) {
    if (playerId === this.firstPlayer.userId) {
      return this.firstPlayer;
    } else if (playerId === this.secondPlayer.userId) {
      return this.secondPlayer;
    }
    console.log('error');
  }

  static create(player: Player) {
    const game = new Game();
    game.id = uuid();
    game.firstPlayer = player;
    game.status = GameStatus.PendingSecondPlayer;
    return game;
  }

  startGame(player: Player, questions: Question[]) {
    this.secondPlayer = player;
    this.startGameDate = new Date(Date.now());
    this.status = GameStatus.Active;

    let orderNumber = 0;
    this.gameQuestions = questions.map(
      (question) => new GameQuestions(this.id, question.id, ++orderNumber),
    );
  }

  // private calcScores(currentUsersAnswers: Answer[], opponentUserAnswers: Answer[]) {
  //   let currentUserScore = this.calcCorrectAnswers(currentUsersAnswers);
  //   let opponentUserScore = this.calcCorrectAnswers(opponentUserAnswers);
  //
  //   const latestAnswerCurrentUser = currentUsersAnswers.reduce((a, b) =>
  //     a.addedAt > b.addedAt ? a : b,
  //   );
  //   const latestAnswerOpponentUser = opponentUserAnswers.reduce((a, b) =>
  //     a.addedAt > b.addedAt ? a : b,
  //   );
  //
  //   if (
  //     latestAnswerCurrentUser.addedAt > latestAnswerOpponentUser.addedAt &&
  //     currentUserScore > 0
  //   ) {
  //     currentUserScore++;
  //   } else if (
  //     latestAnswerOpponentUser.addedAt > latestAnswerCurrentUser.addedAt &&
  //     opponentUserScore > 0
  //   ) {
  //     opponentUserScore++;
  //   }
  //   return {
  //     scoreCurrentUser: currentUserScore,
  //     scoreOpponent: opponentUserScore,
  //   };
  // }
  //
  // private calcCorrectAnswers(answers: Answer[]): number {
  //   return answers.reduce((score, item) => {
  //     return item.answerStatus === AnswerStatus.Correct ? score++ : score;
  //   }, 0);
  // }

  sendAnswer(playerId: string, answer: string) {
    const currentPlayer = this.currentPlayer(playerId);
    this.checkCountAnswers(currentPlayer.answers);

    const currentQuestion = this.gameQuestions.find(
      (i) => i.orderInGame === currentPlayer.answers.length + 1,
    );

    const answerStatus = currentQuestion.question.correctAnswers.includes(answer)
      ? AnswerStatus.Correct
      : AnswerStatus.Incorrect;

    currentPlayer.answers.push(new Answer(currentQuestion.questionId, answerStatus));
    if (answerStatus === AnswerStatus.Correct) {
      currentPlayer.score += 1;
    }

    if (this.isFinish()) {
      this.status = GameStatus.Finished;
      this.finishGameDate = new Date(Date.now());
    }
  }

  private checkCountAnswers(answers: Answer[]) {
    if (answers.length === this.gameQuestions.length) {
      throw new ForbiddenException();
    }
  }

  private isFinish(): boolean {
    const countAllAnswers =
      this.firstPlayer.answers.length + this.secondPlayer.answers.length;
    return countAllAnswers === this.gameQuestions.length * 2;
  }

  private bonusPoint() {}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../domain/entity/game.entity';
import { Repository } from 'typeorm';
import { BaseRepository } from './baseRepository';

import { Answer } from '../../domain/entity/answers.entity';
import { GameViewModel } from '../../application/dto/response/game.view-model';
import { log } from 'util';
import { GameScore } from '../../domain/entity/gameScores.entity';

@Injectable()
export class GameRepository extends BaseRepository<Game> {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {
    super(gameRepo);
  }

  async getFreeGame() {
    const game = await this.gameRepo.findOne({
      where: { status: 'PendingSecondPlayer' },
    });
    return game;
  }

  async getUserGame(userId: string) {
    const game = this.gameRepo
      .createQueryBuilder('g')
      .select()
      .where(
        `(g.firstPlayerId = :userId or g.secondPlayerId = :userId) and (g.status ='Active' or g.status = 'PendingSecondPlayer') `,
        { userId },
      )
      .getOne();
    return game;
  }

  async create(userId: string) {
    const game = Game.create(userId);
    await this.save(game);
    return game;
  }

  async getActiveGame(userId: string) {
    const game = this.gameRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.gameQuestions', 'gameQuestions')
      .leftJoinAndSelect('gameQuestions.question', 'question')
      .leftJoinAndSelect('g.answers', 'answers')
      .where(
        `(g.firstPlayer = :userId or g.secondPlayer = :userId) and g.status = 'Active'`,
        { userId },
      )
      .getOne();
    return game;
  }

  async getMyCurrentGame(userId: string) {
    const game = await this.gameRepo
      .createQueryBuilder('g')
      .where(
        `(g.firstPlayerId = :userId or g.secondPlayerId = :userId) and g.status != 'Finished' `,
        { userId },
      )
      .addSelect(['firstPlayer.login', 'secondPlayer.login'])
      .leftJoinAndSelect('g.gameQuestions', 'gameQuestions')
      .leftJoin('g.firstPlayer', 'firstPlayer')
      .leftJoin('g.secondPlayer', 'secondPlayer')
      .leftJoinAndSelect('g.answers', 'answers')
      .getOne();
    return new GameViewModel(game);
  }
}

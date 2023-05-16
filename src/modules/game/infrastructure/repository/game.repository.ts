import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../domain/entity/game.entity';
import { Repository } from 'typeorm';
import { BaseRepository } from './baseRepository';

import { Answer } from '../../domain/entity/answers.entity';

@Injectable()
export class GameRepository extends BaseRepository<Game> {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {
    super(gameRepo);
  }

  async getById(id: string): Promise<Game | null> {
    return this.gameRepo.findOne({ where: { id }, relations: ['gameQuestions'] });
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
        `(g.firstPlayer = :userId or g.secondPlayer = :userId) and (g.status ='Active' or g.status = 'PendingSecondPlayer') `,
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
        `(g.firstPlayer = :userId or g.secondPlayer = :userId) and g.status != 'Finished' `,
        { userId },
      )
      .leftJoinAndSelect('g.gameQuestions', 'gameQuestions')
      .leftJoinAndMapMany(
        'g.firstAnswers',
        'g.answers',
        'firstPlayerAnswers',
        'g."firstPlayer" = "firstPlayerAnswers"."userId"',
      )
      .leftJoinAndMapMany(
        'g.secondAnswers',
        'g.answers',
        'secondPlayerAnswers',
        'g."secondPlayer" = "secondPlayerAnswers"."userId"',
      )

      .getOne();

    return game;
  }
}

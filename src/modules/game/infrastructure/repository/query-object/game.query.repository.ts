import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../../domain/entity/game.entity';
import { GameViewModel } from '../../../application/dto/response/game.view-model';

@Injectable()
export class GameQueryRepository {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}

  async getById(userId: string) {
    const game = await this.gameRepo
      .createQueryBuilder('g')
      .where(`g.id = :userId`, { userId })
      .addSelect(['firstPlayer.login', 'secondPlayer.login'])
      .leftJoinAndSelect('g.gameQuestions', 'gameQuestions')
      .leftJoin('g.firstPlayer', 'firstPlayer')
      .leftJoin('g.secondPlayer', 'secondPlayer')
      .leftJoinAndSelect('g.answers', 'answers')
      .getOne();
    return new GameViewModel(game);
  }
}

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../users/domain/entity/user.entity';
import { Game } from './game.entity';

@Entity('GameScores')
export class GameScore {
  @PrimaryColumn()
  gameId: string;

  @PrimaryColumn()
  userId: string;

  @Column()
  score: number;

  @ManyToOne(() => User, (u) => u.id)
  user: User;

  @ManyToOne(() => Game, (g) => g.id)
  game: Game;

  constructor(gameId: string, userId: string, score: number) {
    this.score = score;
    this.userId = userId;
    this.gameId = gameId;
  }
}

import { Answer } from '../../../domain/entity/answers.entity';
import { Player } from '../../../domain/entity/player.entity';

export class PlayerViewModel {
  answers: Answer[];
  player: {
    id: string;
    login: string;
  };
  score: number;

  constructor(player: Player) {
    this.player = {
      id: player.id,
      login: player.user.login,
    };
    this.answers = player.answers;
    this.score = 0;
  }
}

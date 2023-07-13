import { Game } from '../../../domain/entity/game.entity';
import { PlayerViewModel } from './player.view-model';

export class GameViewModel {
  id: string;
  firstPlayerProgress: PlayerViewModel;
  secondPlayerProgress: PlayerViewModel;
  questions: QuestionViewModel[];
  status: string;
  pairCreatedDate: Date;
  startGameDate: Date;
  finishGameDate: Date;

  constructor(game: Game) {
    this.pairCreatedDate = game.pairCreatedDate;
    this.finishGameDate = game.finishGameDate;
    this.startGameDate = game.startGameDate;
    this.status = game.status;
    this.questions = game.gameQuestions.map((i) => {
      return new QuestionViewModel(i.id, i.question.body);
    });
    this.firstPlayerProgress = new PlayerViewModel(game.firstPlayer);
    this.secondPlayerProgress = new PlayerViewModel(game.secondPlayer);
  }
}

class QuestionViewModel {
  id: string;
  body: string;
  constructor(id: string, body: string) {
    this.id = id;
    this.body = body;
  }
}

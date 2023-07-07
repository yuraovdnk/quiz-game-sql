import { Answer } from '../../../domain/entity/answers.entity';
import { Game } from '../../../domain/entity/game.entity';

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
    console.log(game);
    this.pairCreatedDate = game.pairCreatedDate;
    this.finishGameDate = game.finishGameDate;
    this.startGameDate = game.startGameDate;
    this.status = game.status;
    this.questions = game.gameQuestions.map((i) => {
      return new QuestionViewModel(i.id, i.question.body);
    });
    // this.firstPlayerProgress = new PlayerViewModel(
    //   game.firstPlayerId,
    //   game.firstPlayer.login,
    //   game.answers,
    // );
    //
    // this.secondPlayerProgress = game.secondPlayerId
    //   ? new PlayerViewModel(
    //       game.secondPlayerId,
    //       game.secondPlayer.login,
    //       game.answers,
    //     )
    //   : null;
  }
}

class QuestionViewModel {
  constructor(public id: string, public body: string) {}
}

class PlayerViewModel {
  answers: Answer[];
  player: {
    id: string;
    login: string;
  };
  score: number;

  constructor(id: string, login: string, answers: Answer[]) {
    this.player = {
      id,
      login,
    };
    this.answers = answers.filter((i) => i.userId === id);
    this.score = 0;
  }
}

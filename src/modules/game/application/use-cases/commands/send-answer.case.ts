import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../../infrastructure/repository/game.repository';
import { QuestionsRepository } from '../../../infrastructure/repository/questions.repository';

export class SendAnswerCommand implements ICommand {
  constructor(public userId: string, public readonly answer: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler {
  constructor(
    private gameRepository: GameRepository,
    private questionsRepository: QuestionsRepository,
  ) {}
  async execute(command: SendAnswerCommand) {
    const game = await this.gameRepository.activeGame2(command.userId);

    game.sendAnswer(command.userId, command.answer);
    // const activeGame = await this.gameRepository.getActiveGame(command.userId);
    //
    // if (!activeGame) throw new ForbiddenException();
    //
    // activeGame.sendAnswer(command.answer, command.userId);
    //

    await this.gameRepository.save(game);
    // return;
  }
}

import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../../infrastructure/repository/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { QuestionsRepository } from '../../../infrastructure/repository/questions.repository';

export class CreatePairCommand implements ICommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairCommand)
export class CreatePairHandler implements ICommandHandler {
  constructor(
    private gameRepository: GameRepository,
    private questionRepository: QuestionsRepository,
  ) {}

  async execute(command: CreatePairCommand): Promise<string> {
    const activeGame = await this.gameRepository.getUserGame(command.userId);
    if (activeGame) throw new ForbiddenException();

    const game = await this.gameRepository.getFreeGame();
    if (!game) {
      const game = await this.gameRepository.create(command.userId);
      return game.id;
    }

    const randomQuestions = await this.questionRepository.getRandom();

    game.startGame(command.userId, randomQuestions);

    await this.gameRepository.save(game);
    return game.id;
  }
}

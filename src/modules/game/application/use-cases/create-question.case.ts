import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IGameRepositoryInterface } from '../../domain/repository/game-repository.interface';

export class CreateQuestionCommand {
  constructor(
    public readonly body: string,
    public readonly correctAnswers: [string],
  ) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler implements ICommandHandler {
  constructor(private gameRepo: IGameRepositoryInterface) {}
  async execute(command: any): Promise<boolean> {
    return true;
  }
}

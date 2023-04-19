import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/repository/game.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteQuestionCommand implements ICommand {
  constructor(public readonly questionId: string) {}
}
@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private gameRepo: GameRepository) {}

  async execute(command: DeleteQuestionCommand): Promise<any> {
    const question = await this.gameRepo.getById(command.questionId);
    console.log(question);

    if (!question) throw new NotFoundException();
    await this.gameRepo.delete(question);
  }
}

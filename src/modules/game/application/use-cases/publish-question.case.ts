import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/repository/game.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PublishQuestionDto } from '../dto/request/publish-question';

export class PublishQuestionCommand implements ICommand {
  constructor(
    public readonly questionId: string,
    public readonly publishQuestionDto: PublishQuestionDto,
  ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(private gameRepo: GameRepository) {}

  async execute(command: PublishQuestionCommand): Promise<any> {
    const question = await this.gameRepo.getById(command.questionId);
    if (!question) throw new NotFoundException();

    question.published = command.publishQuestionDto.published;

    return this.gameRepo.save(question);
  }
}

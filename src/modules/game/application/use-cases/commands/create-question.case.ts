import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../../infrastructure/repository/questions.repository';

export class CreateQuestionCommand implements ICommand {
  constructor(
    public readonly body: string,
    public readonly correctAnswers: string[],
  ) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler implements ICommandHandler {
  constructor(private gameRepo: QuestionsRepository) {}
  async execute(command: CreateQuestionCommand): Promise<string> {
    const question = await this.gameRepo.create(command);
    return question.id;
  }
}

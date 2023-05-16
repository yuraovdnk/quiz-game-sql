import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../../infrastructure/repository/questions.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateQuestionDto } from '../../dto/request/update-question.dto';

export class UpdateQuestionCommand implements ICommand {
  constructor(
    public readonly questionId: string,
    public readonly updateQuestionDto: UpdateQuestionDto,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler implements ICommandHandler {
  constructor(private gameRepo: QuestionsRepository) {}
  async execute(command: UpdateQuestionCommand): Promise<any> {
    const question = await this.gameRepo.getById(command.questionId);
    if (!question) throw new NotFoundException();

    question.body = command.updateQuestionDto.body;
    question.correctAnswers = command.updateQuestionDto.correctAnswers;
    return this.gameRepo.save(question);
  }
}

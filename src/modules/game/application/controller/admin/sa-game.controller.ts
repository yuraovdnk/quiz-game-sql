import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionDto } from '../../dto/request/createQuestion.dto';
import { BasicAuthGuard } from '../../../../auth/application/strategies/basic.strategy';
import { CreateQuestionCommand } from '../../use-cases/create-question.case';
import { Question } from '../../../domain/entity/questions.entity';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class SaGameController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.commandBus.execute<CreateQuestionCommand, Question>(
      new CreateQuestionCommand(
        createQuestionDto.body,
        createQuestionDto.correctAnswers,
      ),
    );
  }
}

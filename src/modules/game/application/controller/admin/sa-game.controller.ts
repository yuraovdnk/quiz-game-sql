import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionDto } from '../../dto/request/createQuestion.dto';
import { BasicAuthGuard } from '../../../../auth/application/strategies/basic.strategy';
import { CreateQuestionCommand } from '../../use-cases/create-question.case';
import { Question } from '../../../domain/entity/questions.entity';
import { GameRepository } from '../../../infrastructure/repository/game.repository';
import { DeleteQuestionCommand } from '../../use-cases/delete-question.case';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class SaGameController {
  constructor(private commandBus: CommandBus, private gameRepo: GameRepository) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    const question = await this.commandBus.execute<CreateQuestionCommand, Question>(
      new CreateQuestionCommand(
        createQuestionDto.body,
        createQuestionDto.correctAnswers,
      ),
    );
    return this.gameRepo.getById(question.id);
  }

  @Delete(':id')
  async deleteQuestion(
    @Param('id', ParseUUIDPipe) questionId: string,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteQuestionCommand, boolean>(
      new DeleteQuestionCommand(questionId),
    );
  }
}

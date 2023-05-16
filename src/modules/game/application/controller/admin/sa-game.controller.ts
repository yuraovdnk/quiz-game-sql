import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionDto } from '../../dto/request/create-question.dto';
import { BasicAuthGuard } from '../../../../auth/application/strategies/basic.strategy';
import { CreateQuestionCommand } from '../../use-cases/commands/create-question.case';
import { QuestionsRepository } from '../../../infrastructure/repository/questions.repository';
import { DeleteQuestionCommand } from '../../use-cases/commands/delete-question.case';
import { UpdateQuestionCommand } from '../../use-cases/commands/update-question.case';
import { UpdateQuestionDto } from '../../dto/request/update-question.dto';
import { SaFindGamesOptionsDto } from '../../dto/request/sa-find-games-options.dto';
import { Question } from '../../../domain/entity/questions.entity';
import { PublishQuestionCommand } from '../../use-cases/commands/publish-question.case';
import { PageDto } from '../../../../../common/utils/PageDto';
import { PublishQuestionDto } from '../../dto/request/publish-question';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class SaGameController {
  constructor(
    private commandBus: CommandBus,
    private gameRepo: QuestionsRepository,
  ) {}

  @Get()
  async getAll(
    @Query() findOptions: SaFindGamesOptionsDto,
  ): Promise<PageDto<Question>> {
    return this.gameRepo.getAll(findOptions);
  }

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    const questionId = await this.commandBus.execute<CreateQuestionCommand, string>(
      new CreateQuestionCommand(
        createQuestionDto.body,
        createQuestionDto.correctAnswers,
      ),
    );
    return this.gameRepo.getById(questionId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(
    @Param('id', ParseUUIDPipe) questionId: string,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteQuestionCommand, boolean>(
      new DeleteQuestionCommand(questionId),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('id', ParseUUIDPipe) questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.commandBus.execute<UpdateQuestionCommand, boolean>(
      new UpdateQuestionCommand(questionId, updateQuestionDto),
    );
  }

  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(
    @Param('id', ParseUUIDPipe) questionId: string,
    @Body() publishQuestionDto: PublishQuestionDto,
  ) {
    return this.commandBus.execute<PublishQuestionCommand, void>(
      new PublishQuestionCommand(questionId, publishQuestionDto),
    );
  }
}

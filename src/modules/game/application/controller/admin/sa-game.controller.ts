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
import { CreateQuestionCommand } from '../../use-cases/create-question.case';
import { GameRepository } from '../../../infrastructure/repository/game.repository';
import { DeleteQuestionCommand } from '../../use-cases/delete-question.case';
import { UpdateQuestionCommand } from '../../use-cases/update-question.case';
import { UpdateQuestionDto } from '../../dto/request/update-question.dto';
import { SaFindGamesOptionsDto } from '../../dto/request/sa-find-games-options.dto';
import { Question } from '../../../domain/entity/questions.entity';
import { PublishQuestionCommand } from '../../use-cases/pubish-question.case';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class SaGameController {
  constructor(private commandBus: CommandBus, private gameRepo: GameRepository) {}

  @Get()
  async getAll(@Query() findOptions: SaFindGamesOptionsDto): Promise<Question[]> {
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
  async updateQuestion(
    @Param('id', ParseUUIDPipe) questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.commandBus.execute<UpdateQuestionCommand, boolean>(
      new UpdateQuestionCommand(questionId, updateQuestionDto),
    );
  }

  @Put(':id/publish')
  async publishQuestion(
    @Param('id', ParseUUIDPipe) questionId: string,
    @Body('published', ParseBoolPipe) publishedStatus: boolean,
  ) {
    return this.commandBus.execute<PublishQuestionCommand, void>(
      new PublishQuestionCommand(questionId, publishedStatus),
    );
  }
}

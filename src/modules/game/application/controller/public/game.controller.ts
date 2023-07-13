import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../../../../common/guards/jwt.strategy';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { CreatePairCommand } from '../../use-cases/commands/create-pair.case';
import {
  SendAnswerCommand,
  SendAnswerHandler,
} from '../../use-cases/commands/send-answer.case';
import { GameRepository } from '../../../infrastructure/repository/game.repository';
import { GameQueryRepository } from '../../../infrastructure/repository/query-object/game.query.repository';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtGuard)
export class GameController {
  constructor(
    private commandBus: CommandBus,
    private gameRepo: GameRepository,
    private gameQueryRepo: GameQueryRepository,
  ) {}

  @Get('my-current')
  async getGame(@CurrentUser() userId: string) {
    return this.gameRepo.getUserGame2(userId);
  }

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async createPair(@CurrentUser() userId: string) {
    const gameId = await this.commandBus.execute<CreatePairCommand, string>(
      new CreatePairCommand(userId),
    );

    return this.gameQueryRepo.getById(gameId);
  }

  @Post('my-current/answers')
  async sendAnswer(@CurrentUser() userId: string, @Body('answer') answer: string) {
    return this.commandBus.execute<SendAnswerCommand, SendAnswerHandler['execute']>(
      new SendAnswerCommand(userId, answer),
    );
  }
}

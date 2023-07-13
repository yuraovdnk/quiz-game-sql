import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { SaGameController } from './application/controller/admin/sa-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity/questions.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionsRepository } from './infrastructure/repository/questions.repository';
import { CreateQuestionHandler } from './application/use-cases/commands/create-question.case';
import { DeleteQuestionHandler } from './application/use-cases/commands/delete-question.case';
import { UpdateQuestionHandler } from './application/use-cases/commands/update-question.case';
import { PublishQuestionHandler } from './application/use-cases/commands/publish-question.case';
import { GameController } from './application/controller/public/game.controller';
import { CreatePairHandler } from './application/use-cases/commands/create-pair.case';
import { Game } from './domain/entity/game.entity';
import { GameRepository } from './infrastructure/repository/game.repository';
import { Answer } from './domain/entity/answers.entity';
import { SendAnswerHandler } from './application/use-cases/commands/send-answer.case';
import { GameQuestions } from './domain/entity/gameQuestions.entity';
import { GameQueryRepository } from './infrastructure/repository/query-object/game.query.repository';
import { GameScore } from './domain/entity/gameScores.entity';
import { Player } from './domain/entity/player.entity';

const useCases = [
  CreateQuestionHandler,
  DeleteQuestionHandler,
  UpdateQuestionHandler,
  PublishQuestionHandler,
  CreatePairHandler,
  SendAnswerHandler,
];
@Module({
  imports: [
    CqrsModule,
    UserModule,
    TypeOrmModule.forFeature([
      Question,
      Game,
      Answer,
      GameQuestions,
      GameScore,
      Player,
    ]),
  ],
  controllers: [SaGameController, GameController],
  providers: [QuestionsRepository, GameRepository, GameQueryRepository, ...useCases],
})
export class GameModule {}

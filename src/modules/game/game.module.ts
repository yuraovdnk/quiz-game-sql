import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { SaGameController } from './application/controller/admin/sa-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity/questions.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GameRepository } from './infrastructure/repository/game.repository';
import { CreateQuestionHandler } from './application/use-cases/create-question.case';

const useCases = [CreateQuestionHandler];
@Module({
  imports: [CqrsModule, UserModule, TypeOrmModule.forFeature([Question])],
  controllers: [SaGameController],
  providers: [GameRepository],
})
export class GameModule {}

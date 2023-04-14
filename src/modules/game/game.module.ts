import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { SaGameController } from './application/controller/admin/sa-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity/questions.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GameRepository } from './infrastructure/repository/game.repository';
import { CreateQuestionHandler } from './application/use-cases/create-question.case';
import { DeleteQuestionHandler } from './application/use-cases/delete-question.case';

const useCases = [CreateQuestionHandler, DeleteQuestionHandler];
@Module({
  imports: [CqrsModule, UserModule, TypeOrmModule.forFeature([Question])],
  controllers: [SaGameController],
  providers: [GameRepository, ...useCases],
})
export class GameModule {}

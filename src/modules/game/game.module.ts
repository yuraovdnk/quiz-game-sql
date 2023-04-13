import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { SaGameController } from './application/controller/admin/sa-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/entity/questions.entity';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [];
@Module({
  imports: [CqrsModule, UserModule, TypeOrmModule.forFeature([Question])],
  controllers: [SaGameController],
})
export class GameModule {}

import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('sa/quiz/questions')
export class SaGameController {
  constructor(private commandBus: CommandBus) {}
  @Post()
  async createQuestion() {}
}

import { IGameRepositoryInterface } from '../../domain/repository/game-repository.interface';
import { CreateQuestionDto } from '../../application/dto/request/createQuestion.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/entity/questions.entity';
import { Repository } from 'typeorm';
///extends
@Injectable()
export class GameRepository implements IGameRepositoryInterface {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  getById(any: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<boolean> {
    return true;
  }
}

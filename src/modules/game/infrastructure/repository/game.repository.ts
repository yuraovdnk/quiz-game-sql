import { CreateQuestionDto } from '../../application/dto/request/create-question.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/entity/questions.entity';
import { Repository } from 'typeorm';
import { SaFindGamesOptionsDto } from '../../application/dto/request/sa-find-games-options.dto';
import { SortedFieldsUser } from '../../../users/application/types/user.types';
import { SortedFieldsGame } from '../../application/types/game.types';
///extends
@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}
  async getAll(findOptions: SaFindGamesOptionsDto) {
    const queryBuilder = this.questionRepo
      .createQueryBuilder('g')
      .select()
      .where('g.body like :bodySearchTerm', {
        bodySearchTerm: `%${findOptions.bodySearchTerm}%`,
      })
      .orderBy(`"${findOptions.sortByField(SortedFieldsGame)}"`, findOptions.order)
      .limit(findOptions.pageSize)
      .offset(findOptions.skip)
      .getMany();
    return queryBuilder;
  }
  async getById(id: string): Promise<Question | null> {
    return this.questionRepo.findOneBy({ id });
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = Question.create(
      createQuestionDto.body,
      createQuestionDto.correctAnswers,
    );
    await this.questionRepo.save(question);
    return question;
  }
  async delete(question: Question) {
    await this.questionRepo.remove(question);
  }
  async save(entity: Question) {
    await this.questionRepo.save(entity);
  }
}

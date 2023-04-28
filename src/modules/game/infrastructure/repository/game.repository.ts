import { CreateQuestionDto } from '../../application/dto/request/create-question.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/entity/questions.entity';
import { Repository } from 'typeorm';
import { SaFindGamesOptionsDto } from '../../application/dto/request/sa-find-games-options.dto';
import { SortedFieldsGame } from '../../application/types/game.types';
import { PageDto } from '../../../../common/utils/PageDto';
import { BaseRepository } from './baseRepository';

@Injectable()
export class GameRepository extends BaseRepository<Question> {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {
    super(questionRepo);
  }

  async getAll(findOptions: SaFindGamesOptionsDto): Promise<PageDto<Question>> {
    const [questions, totalCount] = await this.questionRepo
      .createQueryBuilder('g')
      .select()
      .where(
        `g.body like :bodySearchTerm
                and (:publishedStatus = 'all'
                or (:publishedStatus = 'published' and g.published = true)
                or (:publishedStatus = 'notPublished' and g.published = false))
      `,
        {
          bodySearchTerm: `%${findOptions.bodySearchTerm}%`,
          publishedStatus: findOptions.publishedStatus,
        },
      )
      .orderBy(`"${findOptions.sortByField(SortedFieldsGame)}"`, findOptions.order)
      .limit(findOptions.pageSize)
      .offset(findOptions.skip)
      .getManyAndCount();
    return new PageDto(questions, findOptions, totalCount);
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
}

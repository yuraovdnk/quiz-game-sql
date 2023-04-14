import { CreateQuestionDto } from '../../application/dto/request/createQuestion.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/entity/questions.entity';
import { Repository } from 'typeorm';
///extends
@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async getById(id: string): Promise<any> {
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
    return this.questionRepo.remove(question);
  }
}

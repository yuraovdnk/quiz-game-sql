import { CreateQuestionDto } from '../../application/dto/request/createQuestion.dto';

export interface IGameRepositoryInterface {
  getById(any: string): Promise<any>;
  create(createQuestionDto: CreateQuestionDto): Promise<boolean>;
}

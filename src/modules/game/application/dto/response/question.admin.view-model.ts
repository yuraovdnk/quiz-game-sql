import { Question } from '../../../domain/entity/questions.entity';

export class QuestionAdminViewModel {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(question: Question) {
    this.id = question.id;
    this.body = question.body;
    this.published = question.published;
    this.updatedAt = question.updatedAt;
    this.createdAt = question.createdAt;
    this.correctAnswers = question.correctAnswers;
  }
}

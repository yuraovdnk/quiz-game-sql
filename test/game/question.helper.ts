import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { QuestionViewModel } from '../../src/modules/game/application/dto/response/question.view-model';

export class QuestionHelper {
  static async createQuestion(app: INestApplication) {
    const questionPayload = {
      body: 'Who is Leo Messsi',
      correctAnswers: ['footballer', 'boxer'],
    };
    const question = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth(process.env.USER_NAME, process.env.PASSWORD)
      .send(questionPayload)
      .expect(201);
    expect(question.body.body).toEqual(questionPayload.body);
    expect(question.body.correctAnswers).toEqual(questionPayload.correctAnswers);
    expect(question.body.updatedAt).toBeNull();
    expect(question.body.id).toBeDefined();

    return question.body as QuestionViewModel;
  }
}

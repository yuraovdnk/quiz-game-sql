import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestService } from '../../src/modules/testing/test.service';
import { QuestionHelper } from './question.helper';

describe('sa-question', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await moduleFixture.get(TestService).clearDb();
  });

  describe('Create question', () => {
    it('should create question', () => {
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty')
        .send({
          body: 'sdsadas',
          correctAnswers: ['wqeqweq', '42342342'],
        })
        .expect(201);
    });

    it('should not create question', () => {
      request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth('admin', 'qwerty')
        .send({
          body: 'sda',
          correctAnswers: ['string', 'terrew'],
        })
        .expect(400);
    });
  });
  describe('delete questions', () => {
    it('should not delete ', async function () {
      const question = await QuestionHelper.createQuestion(app);
      request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${question.id}`)
        .auth('admin', 'qwerty')
        .expect(204);
    });
  });
});

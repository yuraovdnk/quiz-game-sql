import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestService } from '../../src/modules/testing/test.service';
import { QuestionHelper } from './question.helper';
import { v4 as uuid } from 'uuid';
import { createApp } from '../../src/main';
import { PageDto } from '../../src/common/utils/PageDto';
import { Question } from '../../src/modules/game/domain/entity/questions.entity';

jest.setTimeout(10000);

describe('sa-question', () => {
  let app: INestApplication;
  const baseUrl = `/sa/quiz/questions/`;
  let moduleFixture: TestingModule = null;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);

    await app.init();
  });

  beforeEach(async () => {
    await moduleFixture.get(TestService).clearDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create question', () => {
    it('should create question', async () => {
      await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .send({
          body: 'sdsadas Illya Stepa',
          correctAnswers: ['wqeqweqvxcvxv', '42342342'],
        })
        .expect(201);
    });

    it('should not create question because payload incorrect', async () => {
      await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .send({
          body: 'sda',
          correctAnswers: ['string', 'terrew'],
        })
        .expect(400);
    });
  });

  describe('delete question', () => {
    it('should delete ', async function () {
      const question = await QuestionHelper.createQuestion(app);
      await request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${question.id}`)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/sa/quiz/questions/${question.id}`)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(404);
    });
    it('shouldn`t delete', async function () {
      const fakeId = uuid();
      await request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${fakeId}`)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(404);
    });
  });

  describe('Update question', () => {
    it('should update question ', async function () {
      const question = await QuestionHelper.createQuestion(app);
      const fakeData = {
        body: 'Who is Leo Ronaldo',
        correctAnswers: ['footballer', 'boxer'],
      };
      await request(app.getHttpServer())
        .put(baseUrl + question.id)
        .send(fakeData)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(204);
    });

    it('should not update question if payload incorrect ', async function () {
      const question = await QuestionHelper.createQuestion(app);
      const fakeData = {
        body: 'W',
        correctAnswers: [],
      };
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/` + question.id)
        .send(fakeData)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(400);
    });

    it('should not update question if not exist ', async function () {
      const fakeId = uuid();
      const fakeData = {
        body: 'Who is Leo Ronaldo',
        correctAnswers: ['footballer', 'boxer'],
      };
      await request(app.getHttpServer())
        .put(baseUrl + fakeId)
        .send(fakeData)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(404);
    });
  });

  describe('get questions', () => {
    it('should get all', async function () {
      const createdQuestionsCount = 10;
      for (let i = 1; i <= createdQuestionsCount; i++) {
        await QuestionHelper.createQuestion(app);
      }

      const pageSize = 1;

      const questions = await request(app.getHttpServer())
        .get(`${baseUrl}?pageSize=${pageSize}`)
        .auth(process.env.USER_NAME, process.env.PASSWORD)
        .expect(200);
      const resBody: PageDto<Question> = questions.body;

      expect(resBody.pageSize).toEqual(pageSize);
      expect(resBody.totalCount).toEqual(createdQuestionsCount);
      expect(resBody.pagesCount).toEqual(pageSize * resBody.totalCount);
    });
  });
});

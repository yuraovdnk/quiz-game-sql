import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import { TestService } from '../../src/modules/testing/test.service';
import { AuthHelper } from '../auth/auth.helper';
import request from 'supertest';

describe('sa-question', () => {
  let app: INestApplication;
  const baseUrl = `/pair-game-quiz/pairs/`;
  let moduleFixture: TestingModule = null;
  let authHelper = null;

  const player1 = {
    login: 'Petro',
    email: 'petro@ukr.net',
    password: '123456',
  };
  const player2 = {
    login: 'Vasya',
    email: 'vasya@ukr.net',
    password: '123456',
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);

    await app.init();
    authHelper = new AuthHelper(app);
  });
  beforeEach(async () => {
    await moduleFixture.get(TestService).clearDb();
  });

  describe('connect to game', () => {
    let user1AccessToken = null;
    let user2AccessToken = null;
    beforeEach(async () => {
      user1AccessToken = await authHelper.createUserAndLogin(player1);
      user2AccessToken = await authHelper.createUserAndLogin(player2);
    });
    it('should not create is user in active game', async function () {
      await request(app.getHttpServer())
        .post(`${baseUrl}connection`)
        .auth(user1AccessToken, { type: 'bearer' })
        .expect(200);

      await request(app.getHttpServer())
        .post(`${baseUrl}connection`)
        .auth(user1AccessToken, { type: 'bearer' })
        .expect(403);
    });

    it('should create game ', async function () {
      const userConnection = await request(app.getHttpServer())
        .post(`${baseUrl}connection`)
        .auth(user1AccessToken, { type: 'bearer' })
        .expect(200);

      expect(userConnection.body.firstPlayer).toBeDefined();
      expect(userConnection.body.secondPlayer).toBeNull();
      expect(userConnection.body.startGameDate).toBeNull();
      expect(userConnection.body.finishGameDate).toBeNull();
      expect(userConnection.body.pairCreatedDate).toBeDefined();

      const user2Connection = await request(app.getHttpServer())
        .post(`${baseUrl}connection`)
        .auth(user2AccessToken, { type: 'bearer' })
        .expect(200);

      expect(userConnection.body.firstPlayer).toBeDefined();
      expect(userConnection.body.secondPlayer).toBeDefined();
      expect(userConnection.body.startGameDate).toBeDefined();
      expect(userConnection.body.finishGameDate).toBeDefined();
      expect(userConnection.body.pairCreatedDate).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

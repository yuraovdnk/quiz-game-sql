import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserViewModel } from '../../src/modules/users/application/dto/response/user-view.model';

export class AuthHelper {
  constructor(private app: INestApplication) {}

  async createUser(user: { login: string; email: string; password: string }) {
    const registerUser1 = await request(this.app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty')
      .send(user)
      .expect(201);
    return registerUser1.body as UserViewModel;
  }

  async login(loginOrEmail: string, password: string) {
    const loginBody = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail,
        password,
      })
      .expect(200);
    return loginBody.body.accessToken;
  }

  async createUserAndLogin(user: {
    login: string;
    email: string;
    password: string;
  }) {
    const createdUser = await this.createUser(user);
    const accessToken = await this.login(user.login, user.password);
    return accessToken;
  }
}

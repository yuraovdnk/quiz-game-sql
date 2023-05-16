import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  generateTokens(userId: string, deviceId: string) {
    const accessToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets.secretAccessToken'),
        expiresIn: '1d',
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets.secretRefreshToken'),
        expiresIn: '2d',
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}

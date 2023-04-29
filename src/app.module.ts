import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './common/configuration/config';
import { DatabaseModule } from './adapters/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { TruncateData } from './modules/testing/truncateData';
import { TestService } from './modules/testing/test.service';
import { GameModule } from './modules/game/game.module';

export const configModule = ConfigModule.forRoot({
  load: [getConfig],
  isGlobal: true,
  envFilePath: ['.env', '.env.test'],
});
@Module({
  imports: [
    configModule,
    DatabaseModule,
    CqrsModule,
    PassportModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({}),
    AuthModule,
    UserModule,
    GameModule,
  ],
  controllers: [TruncateData],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TestService,
  ],
})
export class AppModule {}

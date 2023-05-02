import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BanUserSubscriber } from '../../modules/users/domain/subscribers/banUser.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        console.log(process.env.NODE_ENV, 'ENVIROMNET');
        console.log(configService.get<string>('db.postgresUriDev'), 'ENVVV');
        console.log(process.env.USER_NAME, 'admin');
        console.log(process.env.POSTGRES_DEV, 'dev');
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: false,
          subscribers: [BanUserSubscriber],
          extra: {
            poolSize: 4,
          },
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_POST,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          ///
          // url:
          //   process.env.NODE_ENV === 'production'
          //     ? configService.get<string>('db.postgresUriProduction')
          //     : configService.get<string>('db.postgresUriDev'),
        };
      },

      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

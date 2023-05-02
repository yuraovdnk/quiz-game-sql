import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BanUserSubscriber } from '../../modules/users/domain/subscribers/banUser.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        console.log(process.env.POSTGRES_USERNAME, 'dev');
        console.log(process.env.POSTGRES_DATABASE, 'dev');
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          subscribers: [BanUserSubscriber],
          extra: {
            poolSize: 4,
          },
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USERNAME,
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

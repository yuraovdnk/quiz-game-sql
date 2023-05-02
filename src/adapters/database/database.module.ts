import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BanUserSubscriber } from '../../modules/users/domain/subscribers/banUser.subscriber';
import { log } from 'util';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        console.log(process.env.NODE_ENV, 'ENVIROMNET');
        console.log(configService.get<string>('db.postgresUriDev'), 'ENVVV');
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          subscribers: [BanUserSubscriber],
          extra: {
            poolSize: 4,
          },
          url:
            process.env.NODE_ENV === 'production'
              ? configService.get<string>('db.postgresUriProduction')
              : configService.get<string>('db.postgresUriDev'),
        };
      },

      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

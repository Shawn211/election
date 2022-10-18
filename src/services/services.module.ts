import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService, configService } from './config.service';

import {
  Candidate,
  Election,
  User,
  Vote
} from '../models';
import { MyLoggerService } from './my-logger.service';
import { RedisService } from './redis.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
      Candidate,
      Election,
      User,
      Vote
    ])
  ],
  providers: [ConfigService, MyLoggerService, RedisService]
})
export class ServicesModule {}

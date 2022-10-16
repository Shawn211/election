import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from './config.service';

import {
  Candidate,
  Election,
  User,
  Vote
} from '../models';

const configService = new ConfigService();

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
  providers: [ConfigService]
})
export class ServicesModule {}

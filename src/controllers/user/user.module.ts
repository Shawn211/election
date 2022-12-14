import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { ConfigService } from '../../services/config.service';
import { RedisService } from '../../services/redis.service';

import { User } from '../../models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, ConfigService, RedisService]
})
export class UserModule {}

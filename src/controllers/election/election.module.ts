import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';

import { Election } from '../../models/election.entity';
import { Candidate } from '../../models/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Election, Candidate])],
  controllers: [ElectionController],
  providers: [ElectionService]
})
export class ElectionModule {}

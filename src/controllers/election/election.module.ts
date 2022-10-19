import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';

import { Election } from '../../models/election.entity';
import { Candidate } from '../../models/candidate.entity';
import { Vote } from '../../models/vote.entity';

import { VoteService } from '../vote/vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([Election, Candidate, Vote])],
  controllers: [ElectionController],
  providers: [ElectionService, VoteService]
})
export class ElectionModule {}

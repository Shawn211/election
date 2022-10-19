import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

import { Vote } from '../../models/vote.entity';
import { Candidate } from '../../models/candidate.entity';
import { Election } from '../../models/election.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Candidate, Election])],
  controllers: [VoteController],
  providers: [VoteService]
})
export class VoteModule {}

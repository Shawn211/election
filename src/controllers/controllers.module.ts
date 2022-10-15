import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CandidateModule } from './candidate/candidate.module';
import { VoteModule } from './vote/vote.module';
import { ElectionModule } from './election/election.module';

@Module({
  imports: [UserModule, CandidateModule, VoteModule, ElectionModule]
})
export class ControllersModule {}

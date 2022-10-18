import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';

import { Candidate } from '../../models/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidateController],
  providers: [CandidateService]
})
export class CandidateModule {}

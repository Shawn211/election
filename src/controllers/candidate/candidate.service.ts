import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Candidate } from '../../models/candidate.entity';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate) 
        private readonly candidateRep: Repository<Candidate>
    ) {}

    public async add(electionId: number, userId: number) {
        return await this.candidateRep.save({ electionId, userId });
    }
}

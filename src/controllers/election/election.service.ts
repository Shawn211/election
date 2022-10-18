import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Election } from '../../models/election.entity';
import { Candidate } from '../../models/candidate.entity';

@Injectable()
export class ElectionService {
    constructor(
        @InjectRepository(Election) 
        private readonly electionRep: Repository<Election>,
        @InjectRepository(Candidate) 
        private readonly candidateRep: Repository<Candidate>
    ) {}

    public async add() {
        return await this.electionRep.save({ status: 0 });
    }

    public async getCandidateCount(electionId: number) {
        return await this.candidateRep.countBy({ electionId });
    }

    public async start(electionId: number) {
        return await this.electionRep.update(electionId, { status: 1 });
    }

    public async stop(electionId: number) {
        return await this.electionRep.update(electionId, { status: 2 });
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, In } from 'typeorm';

import { Vote } from '../../models/vote.entity';
import { Candidate } from '../../models/candidate.entity';
import { Election } from '../../models/election.entity';
import { User } from '../../models/user.entity';

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Vote) 
        private readonly voteRep: Repository<Vote>,
        @InjectRepository(Candidate) 
        private readonly candidateRep: Repository<Candidate>,
        @InjectRepository(Election) 
        private readonly electionRep: Repository<Election>
    ) {}

    public async get(candidateId: number, voterId: number) {
        return await this.voteRep.findOneBy({ candidateId, voterId });
    }

    public async add(candidateId: number, voterId: number) {
        return await this.voteRep.save({ candidateId, voterId });
    }

    public async getCandidate(candidateId: number) {
        return await this.candidateRep.findOneBy({ candidateId });
    }

    public async getElection(electionId: number) {
        return await this.electionRep.findOneBy({ electionId });
    }

    // get candidate info
    private getCandidates(electionId: number): Promise<{
        candidate_candidateId: number,
        user_email: string,
        user_hkId: string
    }[]> {
        return this.candidateRep
            .createQueryBuilder('candidate')
            .where('candidate.electionId = :electionId', { electionId })
            .leftJoinAndSelect(User, 'user', 'user.userId = candidate.userId')
            .select([
                'candidate.candidateId',
                'user.email',
                'user.hkId',
            ])
            .getRawMany();
    }

    // get candidate vote count
    private getVoteCounts(candidateIds: number[]): Promise<{
        vote_candidateId: number,
        count: number
    }[]> {
        return this.voteRep
            .createQueryBuilder('vote')
            .where({ candidateId: In(candidateIds) })
            .leftJoinAndSelect(User, 'user', 'user.userId = vote.voterId')
            .select('vote.candidateId')
            .addSelect('SUM(1)', 'count')
            .groupBy("vote.candidateId")
            .getRawMany();
    }

    // get candidate voters
    private getVotes(candidateIds: number[]): Promise<{
        vote_candidateId: number,
        voters: string
    }[]> {
        return this.voteRep
            .createQueryBuilder('vote')
            .where({ candidateId: In(candidateIds) })
            .leftJoinAndSelect(User, 'user', 'user.userId = vote.voterId')
            .select('vote.candidateId')
            .addSelect('STRING_AGG(user.email, \',\')', 'voters')
            .groupBy("vote.candidateId")
            .getRawMany();
    }

    public async getCurrentElectionState(electionId: number, page = 1) {
        const take = 10;
        const skip = take * (page - 1);

        const candidates = await this.getCandidates(electionId);

        const voteCounts = await this.getVoteCounts(candidates.map(candidate => candidate.candidate_candidateId));

        const voters = await this.getVotes(candidates.map(candidate => candidate.candidate_candidateId));

        const currentElectionStateMap: Map<
            number,
            {
                candidate_candidateId: number,
                user_email: string,
                user_hkId: string,
                voteCount: number,
                voters: string[]
            }
        > = new Map();
        candidates.forEach(candidate => currentElectionStateMap.set(
            candidate.candidate_candidateId,
            {
                ...candidate,
                voteCount: 0,
                voters: []
            }
        ));

        voteCounts.forEach(
            voteCount => currentElectionStateMap.get(voteCount.vote_candidateId).voteCount =
                voteCount.count
        );

        voters.forEach(
            voter => currentElectionStateMap.get(voter.vote_candidateId).voters =
                voter.voters.split(',').slice(skip, skip + take)
        );

        return [...currentElectionStateMap.values()];
    }

    public async getElectionResult(electionId: number) {
        const candidates = await this.getCandidates(electionId);

        const voteCounts = await this.getVoteCounts(candidates.map(candidate => candidate.candidate_candidateId));

        const electionResultMap: Map<number, { user_email: string, user_hkId: string, voteCount: number }> = new Map();
        candidates.forEach(({ candidate_candidateId, user_email, user_hkId }) => electionResultMap.set(
            candidate_candidateId,
            { user_email, user_hkId, voteCount: 0 }
        ));

        voteCounts.forEach(
            voteCount => electionResultMap.get(voteCount.vote_candidateId).voteCount =
                voteCount.count
        );

        return [...electionResultMap.values()];
    }
}

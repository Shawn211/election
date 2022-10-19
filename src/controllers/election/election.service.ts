import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as nodemailer from 'nodemailer';

import { Election } from '../../models/election.entity';
import { Candidate } from '../../models/candidate.entity';

import { VoteService } from '../vote/vote.service';

@Injectable()
export class ElectionService {
    mailerTransporter;

    constructor(
        @InjectRepository(Election) 
        private readonly electionRep: Repository<Election>,
        @InjectRepository(Candidate) 
        private readonly candidateRep: Repository<Candidate>,
        private readonly voteService: VoteService
    ) {}

    public async add() {
        return await this.electionRep.save({ status: 0 });
    }

    public async getList(status?: number) {
        const condition: { status?: number } = {};
        if (status) {
            condition.status = status;
        }
        return await this.electionRep.findBy(condition);
    }

    public async getCandidateCount(electionId: number) {
        return await this.candidateRep.countBy({ electionId });
    }

    public async start(electionId: number) {
        return await this.electionRep.update(electionId, { status: 1 });
    }

    private async initMailerTransporter() {
        if (!this.mailerTransporter) {
            const testAccount = await nodemailer.createTestAccount();
            this.mailerTransporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }
    }

    private sendResultEmail(emails: string[], result: string) {
        return this.mailerTransporter.sendMail({
            from: '"Election Admin" <admin@admin.com>',
            to: emails.join(','),
            subject: "Hello, there is election result.",
            text: result
        });
    }

    private async sendElectionResultEmail(electionId: number) {
        const electionResult = await this.voteService.getElectionResult(electionId);

        await this.initMailerTransporter();

        const emails: string[] = [];
        const result: {
            user_email: string,
            user_hkId: string,
            voteCount: number
        }[] = [];
        for (const { voters, ...candidateResult } of electionResult) {
            emails.push(...voters);
            result.push(candidateResult);
        }
        // return await this.sendResultEmail(emails, JSON.stringify(result, null, 4));
        // print test email url
        const info = await this.sendResultEmail(emails, JSON.stringify(result, null, 4));
        console.log(nodemailer.getTestMessageUrl(info));
    }

    public async stop(electionId: number) {
        this.sendElectionResultEmail(electionId);

        return await this.electionRep.update(electionId, { status: 2 });
    }
}

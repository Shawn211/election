import {
    Controller,
    Get, Post, Patch, Delete,
    Headers, Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ElectionService } from './election.service';

import {
    adminDto,
    startDto,
    stopDto
} from '../../dto/election.dto';

@ApiTags('election')
@Controller('election')
export class ElectionController {
    constructor(
        private readonly electionService: ElectionService
    ) {}

    @Post('add')
    async addElection(
        @Req() req: any,
        @Headers() { token }: adminDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }

        const { electionId } = await this.electionService.add();
        return { electionId };
    }

    @Patch('start')
    async startElection(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Body() { electionId }: startDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }

        const candidateCount = await this.electionService.getCandidateCount(electionId);
        if (candidateCount < 2) {
            throw new BadRequestException();
        }

        await this.electionService.start(electionId);
        return { result: 'success' };
    }

    @Patch('stop')
    async stopElection(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Body() { electionId }: stopDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }

        await this.electionService.stop(electionId);
        return { result: 'success' };
    }
}

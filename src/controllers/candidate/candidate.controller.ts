import {
    Controller,
    Get, Post, Patch, Delete,
    Headers, Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CandidateService } from './candidate.service';

import {
    adminDto,
    addCandidateDto
} from '../../dto/candidate.dto';

@ApiTags('candidate')
@Controller('candidate')
export class CandidateController {
    constructor(
        private readonly candidateService: CandidateService
    ) {}

    @Post('add')
    async addCandidate(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Body() { electionId, userId }: addCandidateDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }

        const { candidateId } = await this.candidateService.add(electionId, userId);
        return { candidateId };
    }
}

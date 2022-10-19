import {
    Controller,
    Get, Post, Patch, Delete,
    Headers, Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    @ApiOperation({ summary: '添加候选人' })
    @ApiResponse({ status: 201, description: '添加成功' })
    @ApiResponse({ status: 400, description: '无效参数' })
    @ApiResponse({ status: 403, description: '无系统管理员权限' })
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

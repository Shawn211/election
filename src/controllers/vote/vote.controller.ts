import {
    Controller,
    Get, Post, Patch, Delete,
    Headers, Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { VoteService } from './vote.service';

import {
    adminDto,
    addVoteDto,
    getCurrentElectionStateDto,
    getElectionResultDto
} from '../../dto/vote.dto';

@ApiTags('vote')
@Controller('vote')
export class VoteController {
    constructor(
        private readonly voteService: VoteService
    ) {}

    @Post('add')
    @ApiOperation({ summary: '发起投票' })
    @ApiResponse({ status: 200, description: '发起成功，并一次性查看选举实时状态' })
    @ApiResponse({ status: 403, description: '已投票' })
    @ApiResponse({ status: 400, description: '选举已结束或暂未开始' })
    async addVote(
        @Req() req: any,
        @Body() { candidateId }: addVoteDto
    ) {
        const { userId } = req.user;

        const candidate = await this.voteService.getCandidate(candidateId);
        if (!candidate) {
            throw new BadRequestException('Invalid candidate');
        }

        const vote = await this.voteService.get(candidateId, userId);
        if (vote) {
            throw new ForbiddenException('Already voted');
        }

        const election = await this.voteService.getElection(candidate.electionId);
        if (election.status !== 1) {
            throw new BadRequestException('Election stopped or not started');
        }

        await this.voteService.add(candidateId, userId);
        
        return await this.voteService.getCurrentElectionState(election.electionId);
    }

    @Get('current')
    @ApiOperation({ summary: '获取指定选举的实时得票情况' })
    @ApiResponse({ status: 200, description: '获取成功' })
    @ApiResponse({ status: 400, description: '无效参数' })
    @ApiResponse({ status: 403, description: '无系统管理员权限' })
    async getCurrentElectionState(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Query() { electionId, page }: getCurrentElectionStateDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }
        
        return await this.voteService.getCurrentElectionState(parseInt(electionId), parseInt(page));
    }

    @Get('result')
    @ApiOperation({ summary: '获取指定选举的最终结果' })
    @ApiResponse({ status: 200, description: '获取成功' })
    @ApiResponse({ status: 400, description: '无效参数' })
    @ApiResponse({ status: 403, description: '无系统管理员权限' })
    async getElectionResult(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Query() { electionId }: getElectionResultDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }
        
        return await this.voteService.getElectionResult(parseInt(electionId));
    }
}

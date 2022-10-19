import {
    Controller,
    Get, Post, Patch, Delete,
    Headers, Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ElectionService } from './election.service';

import {
    adminDto,
    getElectionListDto,
    startElectionDto,
    stopElectionDto
} from '../../dto/election.dto';

@ApiTags('election')
@Controller('election')
export class ElectionController {
    constructor(
        private readonly electionService: ElectionService
    ) {}

    @Post('add')
    @ApiOperation({ summary: '创建选举' })
    @ApiResponse({ status: 201, description: '创建成功' })
    @ApiResponse({ status: 400, description: '无效参数' })
    @ApiResponse({ status: 403, description: '无系统管理员权限' })
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

    @Get('list')
    @ApiOperation({ summary: '获取指定状态的选举' })
    @ApiResponse({ status: 200, description: '查询成功' })
    @ApiResponse({ status: 400, description: '无效参数' })
    async getElectionList(
        @Query() { status }: getElectionListDto
    ) {
        return this.electionService.getList(status);
    }

    @Patch('start')
    @ApiOperation({ summary: '开始选举' })
    @ApiResponse({ status: 200, description: '开始成功' })
    @ApiResponse({ status: 403, description: '无系统管理员权限' })
    @ApiResponse({ status: 400, description: '该选举少于2个候选人' })
    async startElection(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Body() { electionId }: startElectionDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }

        const candidateCount = await this.electionService.getCandidateCount(electionId);
        if (candidateCount < 2) {
            throw new BadRequestException('Less than two candidates');
        }

        await this.electionService.start(electionId);
        return { result: 'success' };
    }

    @Patch('stop')
    @ApiOperation({ summary: '结束选举' })
    @ApiResponse({ status: 200, description: '结束成功，并邮箱通知此次选举投票用户结果' })
    @ApiResponse({ status: 400, description: '无效参数' })
    @ApiResponse({ status: 403, description: '无系统管理员权限' })
    async stopElection(
        @Req() req: any,
        @Headers() { token }: adminDto,
        @Body() { electionId }: stopElectionDto
    ) {
        if (req.user.email !== 'admin@admin.com') {
            throw new ForbiddenException();
        }

        await this.electionService.stop(electionId);
        return { result: 'success' };
    }
}

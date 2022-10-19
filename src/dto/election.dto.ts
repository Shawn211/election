import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsNumber, Matches } from 'class-validator';

export class getElectionListDto {
    @ApiPropertyOptional({ example: '1', description: '选举状态: 0-未开始 1-进行中 2-已结束' })
    @IsNotEmpty()
    @IsString()
    status?: string;
}

export class startElectionDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsNumber()
    electionId: number;
}

export class stopElectionDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsNumber()
    electionId: number;
}

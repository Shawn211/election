import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsNumber, Matches } from 'class-validator';

export class addVoteDto {
    @ApiProperty({ example: '1', description: '候选者ID' })
    @IsNotEmpty()
    @IsNumber()
    candidateId: number;
}

export class getCurrentElectionStateDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsString()
    electionId: string;

    @ApiPropertyOptional({ example: '1', description: '页码' })
    @IsString()
    page?: string;
}

export class getElectionResultDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsString()
    electionId: string;
}

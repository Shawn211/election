import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsNumber, Matches } from 'class-validator';

export class addCandidateDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsNumber()
    electionId: number;

    @ApiProperty({ example: '1', description: '用户ID' })
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}

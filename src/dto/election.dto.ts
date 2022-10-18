import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, isNumberString, Matches } from 'class-validator';

export class adminDto {
    @ApiProperty({ example: '12345678', description: 'token' })
    @IsNotEmpty()
    @IsString()
    @Matches(/[\w\d]{8}/)
    token: string;
}

export class startDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsString()
    electionId: number;
}

export class stopDto {
    @ApiProperty({ example: '1', description: '选举ID' })
    @IsNotEmpty()
    @IsString()
    electionId: number;
}

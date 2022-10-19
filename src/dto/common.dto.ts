import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class tokenDto {
    @ApiProperty({ example: '12345678', description: 'token' })
    @IsNotEmpty()
    @IsString()
    @Matches(/[\w\d]{8}/)
    token: string;
}
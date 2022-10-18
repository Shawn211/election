import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'example@example.com', description: '邮箱' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'A123456(7)', description: '香港身份证号码' })
    @IsNotEmpty()
    @IsString()
    @Matches(/\w\d{6}\(\d\)/)
    hkId: string;
}

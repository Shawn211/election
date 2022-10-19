import {
    Controller,
    Get, Post, Patch, Delete,
    Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserService } from './user.service';

import {
    LoginDto
} from '../../dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('login')
    @ApiOperation({ summary: '用户登记邮箱和验证香港身份证号码，并获得 Token' })
    @ApiResponse({ status: 201, description: '登陆成功' })
    @ApiResponse({ status: 400, description: '无效参数' })
    async login(
        @Body() { email, hkId }: LoginDto
    ) {
        const { token } = await this.userService.login({ email, hkId });
        return { token };
    }
}

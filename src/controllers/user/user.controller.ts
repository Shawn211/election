import {
    Controller,
    Get, Post, Patch, Delete,
    Param, Query, Body,
    Req, Res,
    BadRequestException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
    async login(
        @Body() { email, hkId }: LoginDto
    ) {
        const { token } = await this.userService.login({ email, hkId });
        return { token };
    }
}

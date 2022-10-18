import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RedisService } from '../../services/redis.service';

import { User } from '../../models/user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly redisService: RedisService,
        @InjectRepository(User) 
        private readonly userRep: Repository<User>
    ) {}

    private generateToken(): string {
        return Math.random().toString(36).slice(-8);
    }

    public async login({ email, hkId }: { email: string, hkId: string }) {
        const token = this.generateToken();

        let user = await this.userRep.findOneBy({ email, hkId });
        if (!user) {
            user = await this.userRep.save({ email, hkId });
        }

        this.redisService.set(token, user);
        return { ...user, token };
    }
}

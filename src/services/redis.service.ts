import { Injectable } from '@nestjs/common';

import * as redis from 'redis';

import { configService } from './config.service';
import { myLogger } from './my-logger.service';

@Injectable()
export class RedisService {
    private redisClient;

    constructor() {
        this.initRedis();
    }

    private async initRedis() {
        this.redisClient = redis.createClient({
            socket: configService.getRedisConfig()
        });

        this.redisClient.on('error', (err) => myLogger.error('Redis Client Error: ' + err));
    }

    public set(key: string, value: any) {
        return new Promise((res, rej) => this.redisClient.set(
            key,
            JSON.stringify(value),
            (err, value) => err ? rej(err) : res(value)
        ));
    }

    public get(key: string) {
        return new Promise((res, rej) => this.redisClient.get(
            key,
            (err, value) => err ? rej(err) : res(JSON.parse(value.split(' ').join('')))
        ));
    }
}

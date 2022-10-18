import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

import { myLogger } from '../services/my-logger.service';
import { RedisService } from '../services/redis.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService
  ) {}

  async use(req: any, res: any, next: () => void) {
    if (['/user/login'].includes(req.url)) {
      next();
      return;
    }

    const token = req.headers.token;
    if (!token) {
      myLogger.getHttpLogger(req, res, () => { throw new UnauthorizedException() });
      return;
    }

    const user = await this.redisService.get(token);
    if (!user) {
      myLogger.getHttpLogger(req, res, () => { throw new UnauthorizedException() });
      return;
    }

    req.user = user;

    next();
  }
}

import { Injectable, NestMiddleware, Inject, CACHE_MANAGER, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { myLogger } from '../services/my-logger.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.token;
    if (!token) {
      myLogger.getHttpLogger(req, res, () => { throw new UnauthorizedException() });
      return;
    }

    const user = await this.cacheManager.get(token);
    if (!user) {
      myLogger.getHttpLogger(req, res, () => { throw new UnauthorizedException() });
      return;
    }

    req.user = user;

    next();
  }
}

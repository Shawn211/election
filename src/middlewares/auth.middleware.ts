import { Injectable, NestMiddleware, Inject, CACHE_MANAGER, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.token;
    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.cacheManager.get(token);
    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;

    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';

import { myLogger } from '../services/my-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    myLogger.getHttpLogger(req, res, next);
  }
}

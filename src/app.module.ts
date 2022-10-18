import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';

import { AuthMiddleware } from './middlewares/auth.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';

import { RedisService } from './services/redis.service';

@Module({
  imports: [
    ControllersModule,
    ServicesModule
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

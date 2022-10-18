import { Module, MiddlewareConsumer, RequestMethod, CacheModule } from '@nestjs/common';

import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';

import { configService } from './services/config.service';

import { AuthMiddleware } from './middlewares/auth.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ControllersModule,
    ServicesModule,
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      ...configService.getRedisConfig()
    })
  ],
  controllers: [AppController],
  providers: [AppService],
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

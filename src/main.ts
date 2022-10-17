import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Election')
    .setDescription('The election API description')
    .setVersion('1.0')
    .addTag('user')
    .addTag('election')
    .addTag('candidate')
    .addTag('vote')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.getPort();
  await app.listen(port);
}
bootstrap();

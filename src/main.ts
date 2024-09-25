import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import type { IConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Access the config service
  const configService = app.get<ConfigService<IConfig>>(ConfigService);

  // Create a logger for the bootstrap process

  // Configure Pino for better logging
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  //

  const portToListen = configService.get('port');

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Live Chat API')
    .setDescription('This is a basic chat application API')
    .setVersion('0.1')
    .addServer(`http://localhost:${portToListen}/`, 'Local development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //

  await app.listen(portToListen);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  const logger = new Logger();
  logger.log(
    `Starting server in ${process.env.NODE_ENV} in PORT ${process.env.PORT}`,
  );
  server.listen(process.env.PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './app/common/docs/swagger';
import { HttpExceptionFilter } from './app/common/exception/http-exception.filter';
import { ConfigService } from '@nestjs/config';

declare const module: any;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }))
  // app.setGlobalPrefix("api");


  setupSwagger(app);
  app.enableCors();

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>("port"));
  console.log(configService.get<string>('NODE_ENV'))

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

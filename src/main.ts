import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isCorsIgnored = process.env.IGNORE_CORS === 'true';
  let corsOptions = {};

  if (!isCorsIgnored) {
    corsOptions = {
      origin: [process.env.CLIENT_URL],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };
  }

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

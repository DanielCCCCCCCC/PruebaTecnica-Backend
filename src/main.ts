// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    console.log(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `[DEBUG en main.ts]📨 ${req.method} ${req.url} - ${new Date().toISOString()}`,
    );
    next();
  });
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

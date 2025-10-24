import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 1. Importa ConfigService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // 2. Obtén acceso a ConfigService

  // Middleware de log (opcional, pero útil como lo tenías)
  app.use((req, res, next) => {
    console.log(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `[DEBUG en main.ts]📨 ${req.method} ${req.url} - ${new Date().toISOString()}`,
    );
    next();
  });

  // --- CONFIGURACIÓN DE CORS DINÁMICA ---
  // 3. Lee la variable de entorno FRONTEND_URL
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  console.log(
    `[CORS Config] Allowed frontend URL: ${frontendUrl || 'Not Set (Using fallback: http://localhost:5173)'}`,
  );

  // 4. Habilita CORS usando la variable o el fallback
  app.enableCors({
    origin: frontendUrl || 'http://localhost:5173', // Permite la URL de Render/Cloudflare O localhost
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Añade OPTIONS para preflight
    credentials: true,
  });
  // --- FIN CONFIGURACIÓN DE CORS ---

  // Pipes de Validación Global (Importante tenerlos)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. Lee el puerto desde env, default 3000 (o 10000 para Render)
  const port = configService.get<number>('PORT') || 3000;
  console.log(`[App Start] Listening on port ${port}`);
  await app.listen(port);
}
bootstrap();

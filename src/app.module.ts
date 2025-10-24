// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Importa
// import { AppController } from './app.controller';
// import { VehiclesModule } from './modules/vehicle/vehicle.module';
// import { RecordsModule } from './modules/records/records.module';
// import { DriversModule } from './modules/drivers/driver.module';

// import { AppService } from './app.service';

// @Module({
//   imports: [
//     // 2. Carga el archivo .env
//     ConfigModule.forRoot({
//       isGlobal: true, // Para que esté disponible en toda la app
//       envFilePath: '.env',
//     }),

//     // 3. Configura TypeOrm para *usar* esas variables
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         // --- ¡¡INICIO DE DEPURACIÓN!! ---
//         // Vamos a imprimir lo que ConfigService está leyendo
//         console.log('--- LEYENDO VARIABLES PARA TYPEORM ---');
//         console.log('DB_HOST:', configService.get<string>('DB_HOST'));
//         console.log('DB_PORT:', configService.get('DB_PORT'));
//         console.log('DB_USER:', configService.get<string>('DB_USER'));
//         console.log('DB_PASSWORD:', configService.get<string>('DB_PASSWORD')); // <-- ¿Qué imprime esto?
//         console.log('DB_NAME:', configService.get<string>('DB_NAME'));
//         console.log('--------------------------------------');
//         // --- FIN DE DEPURACIÓN ---

//         const dbPort = configService.get<string>('DB_PORT');
//         return {
//           type: 'postgres',
//           host: configService.get<string>('DB_HOST'),
//           port: dbPort ? +dbPort : 5433, // <-- Convertimos a número con el '+'
//           username: configService.get<string>('DB_USER'),
//           password: configService.get<string>('DB_PASSWORD'),
//           database: configService.get<string>('DB_NAME'),
//           autoLoadEntities: true,
//           synchronize: true,
//         };
//       },
//     }),
//     VehiclesModule,
//     RecordsModule,
//     DriversModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Asegúrate de importar ConfigService

// Importa tus otros módulos (VehicleModule, DriverModule, RecordModule)
import { VehiclesModule } from './modules/vehicle/vehicle.module';
import { DriversModule } from './modules/drivers/driver.module';
import { RecordsModule } from './modules/records/records.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Asegúrate de importar ConfigModule aquí también
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // --- LÓGICA ACTUALIZADA ---
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const nodeEnv = configService.get<string>('NODE_ENV');
        const isProduction = nodeEnv === 'production';

        console.log('--- LEYENDO VARIABLES PARA TYPEORM (AppModule) ---');
        console.log(
          'DATABASE_URL:',
          databaseUrl ? '***ENCONTRADA***' : 'undefined',
        );
        console.log('NODE_ENV:', nodeEnv);
        console.log('--------------------------------------');

        if (databaseUrl) {
          // Si DATABASE_URL existe (Render, Heroku, etc.)
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL en producción
            autoLoadEntities: true,
            synchronize: false, // ¡IMPORTANTE! Siempre false con migraciones
            logging: !isProduction, // Logs SQL solo en desarrollo
          };
        } else {
          // Si no, usar variables individuales (desarrollo local con .env)
          console.log('DB_HOST:', configService.get<string>('DB_HOST'));
          console.log('DB_PORT:', configService.get<number>('DB_PORT'));
          // ... (agrega logs para user, password, name si quieres)

          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5433),
            username: configService.get<string>('DB_USER', 'admin_user'),
            password: configService.get<string>(
              'DB_PASSWORD',
              'admin_password',
            ),
            database: configService.get<string>(
              'DB_NAME',
              'vehicle_management',
            ),
            autoLoadEntities: true,
            synchronize: false, // ¡IMPORTANTE! Siempre false con migraciones
            logging: true, // Logs SQL en desarrollo local
          };
        }
        // --- FIN LÓGICA ACTUALIZADA ---
      },
    }),
    // Tus módulos de features
    VehiclesModule,
    DriversModule,
    RecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

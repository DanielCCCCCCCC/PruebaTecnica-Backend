import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Importa
import { AppController } from './app.controller';
import { VehiclesModule } from './modules/vehicle/vehicle.module';
import { RecordsModule } from './modules/records/records.module';
import { AppService } from './app.service';

@Module({
  imports: [
    // 2. Carga el archivo .env
    ConfigModule.forRoot({
      isGlobal: true, // Para que esté disponible en toda la app
      envFilePath: '.env',
    }),

    // 3. Configura TypeOrm para *usar* esas variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // --- ¡¡INICIO DE DEPURACIÓN!! ---
        // Vamos a imprimir lo que ConfigService está leyendo
        console.log('--- LEYENDO VARIABLES PARA TYPEORM ---');
        console.log('DB_HOST:', configService.get<string>('DB_HOST'));
        console.log('DB_PORT:', configService.get('DB_PORT'));
        console.log('DB_USER:', configService.get<string>('DB_USER'));
        console.log('DB_PASSWORD:', configService.get<string>('DB_PASSWORD')); // <-- ¿Qué imprime esto?
        console.log('DB_NAME:', configService.get<string>('DB_NAME'));
        console.log('--------------------------------------');
        // --- FIN DE DEPURACIÓN ---

        const dbPort = configService.get<string>('DB_PORT');
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: dbPort ? +dbPort : 5433, // <-- Convertimos a número con el '+'
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    VehiclesModule,
    RecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

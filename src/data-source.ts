import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Carga las variables de entorno desde .env
dotenv.config();

// Detecta si estamos en un entorno de producción
const isProduction = process.env.NODE_ENV === 'production';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',

  // Esta lógica es genial:
  // 1. Intenta usar DATABASE_URL (para despliegues en Render, etc.)
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : // 2. Si no existe, usa las variables del .env (para desarrollo local)
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5433', 10),
        // Ajustado a los valores de tu docker-compose.yml como default
        username: process.env.DB_USER || 'admin_user',
        password: process.env.DB_PASSWORD || 'admin_password',
        database: process.env.DB_NAME || 'vehicle_management',
      }),

  // Habilita SSL si DATABASE_URL está presente (común en producción)
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,

  // --- Rutas dinámicas (como en tu ejemplo) ---
  // Usa archivos .js compilados en producción y .ts en desarrollo
  entities: [isProduction ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [
    isProduction ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts',
  ],
  // ---------------------------------------------

  synchronize: false, // Nunca uses true en producción
  logging: !isProduction, // Muestra logs SQL en desarrollo
};

// Exporta la configuración para la CLI
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

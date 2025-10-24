import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Carga las variables de entorno desde .env
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Detecta si el archivo actual se está ejecutando como .ts (desarrollo/cli)
// o como .js (producción)
const isTsNode = __filename.endsWith('.ts');

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',

  // Esta lógica está perfecta
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5433', 10),
        username: process.env.DB_USER || 'admin_user',
        password: process.env.DB_PASSWORD || 'admin_password',
        database: process.env.DB_NAME || 'vehicle_management',
      }),

  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,

  // --- ¡SOLUCIÓN! ---
  // Usar 'isTsNode' en lugar de 'isProduction' para las rutas.
  // La CLI siempre usará .ts, el 'start:prod' siempre usará .js.
  entities: [isTsNode ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
  migrations: [isTsNode ? 'src/migrations/**/*.ts' : 'dist/migrations/**/*.js'],
  // --------------------

  synchronize: false, // Correcto
  logging: !isProduction,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

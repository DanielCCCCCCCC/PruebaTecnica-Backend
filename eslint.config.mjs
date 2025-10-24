// // @ts-check
// import eslint from '@eslint/js';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   {
//     ignores: ['eslint.config.mjs'],
//   },
//   eslint.configs.recommended,
//   ...tseslint.configs.recommendedTypeChecked,
//   eslintPluginPrettierRecommended,
//   {
//     languageOptions: {
//       globals: {
//         ...globals.node,
//         ...globals.jest,
//       },
//       sourceType: 'commonjs',
//       parserOptions: {
//         projectService: true,
//         tsconfigRootDir: import.meta.dirname,
//       },
//     },
//   },
//   {
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'off',
//       '@typescript-eslint/no-floating-promises': 'warn',
//       '@typescript-eslint/no-unsafe-argument': 'warn',
//       "prettier/prettier": ["error", { endOfLine: "auto" }],
//     },
//   },
// );
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Configuración global: Ignorar carpetas
  {
    ignores: [
      'dist', // <-- Importante: Ignorar la salida de compilación
      'node_modules',
      'eslint.config.mjs',
    ],
  },

  // 2. Reglas globales: Para TODOS los archivos (JS, TS, etc.)
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // 3. Reglas SÓLO para TypeScript (tu código fuente)
  {
    files: ['src/**/*.ts'], // <-- ¡LA CLAVE! Aplicar solo a archivos .ts en src/
    extends: [
      ...tseslint.configs.recommendedTypeChecked, // <-- Mover esto aquí
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "^_" }],
      // Reglas que estabas relajando
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      
      // --- ¡SOLUCIÓN A TUS ERRORES DE DTO! ---
      // Bajamos la severidad de 'error' a 'warn' para las reglas "unsafe"
      // que saltan en los decoradores de class-validator
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
  },

  // 4. Configuración SÓLO para archivos de Test (Jest)
  {
    files: [
      'src/**/*.spec.ts',
      'test/**/*.ts',
      '**/*.e2e-spec.ts', // Añadido patrón de NestJS
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Aquí puedes relajar reglas específicas para tests si lo necesitas
      // Por ejemplo, las reglas "unsafe" pueden ser más laxas en los tests
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  // 5. Configuración para archivos JS/MJS (como este mismo archivo)
  {
    files: ['*.mjs', '*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
);
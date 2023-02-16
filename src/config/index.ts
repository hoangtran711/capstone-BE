import { config } from 'dotenv';

config({ path: '.env' });

export const DatabaseConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_LOGGING: process.env.DB_LOGGING === 'true',
};

export const EnvironmentConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT ?? '7749'),
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  API_PREFIX: process.env.API_PREFIX ?? '/api',
  ROOT_URL: process.env.ROOT_URL ?? 'http://localhost:7749',
  APIKEY_HEADER: process.env.APIKEY_HEADER ?? 'x-apikey',
};

export const LogConfig = {
  LOG_FORMAT: process.env.LOG_FORMAT ?? 'dev',
  LOG_DIR: process.env.LOG_DIR ?? 'logs',
};

export const JwtConfig = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION ?? '1h'),
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? 'JWT_APIs',
};

export const UploadFileConfig = {
  LIMIT_FILE_SIZE: 1024 * 1024 * 2,
  LIMIT_FILE_NAME: 255,
};

export * from './project';

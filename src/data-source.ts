import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Template } from './templates/entities/template.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'template_user',
  password: process.env.DB_PASSWORD || 'template_password',
  database: process.env.DB_NAME || 'template_service_db',
  entities: [Template],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // ✅ must be false in production
  logging: true,
});

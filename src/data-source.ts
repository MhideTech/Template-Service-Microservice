import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Template } from './templates/entities/template.entity';
dotenv.config();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const AppDataSource = new DataSource({
  type: 'postgres', // This remains the same
  host: process.env.PGHOST || process.env.DB_HOST,
  port: Number(process.env.PGPORT || process.env.DB_PORT),
  username: process.env.PGUSER || process.env.DB_USERNAME,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  synchronize: true, // Consider setting to false in production and using migrations
  logging: false,
  entities: [Template],
  migrations: [],
  subscribers: [],
});

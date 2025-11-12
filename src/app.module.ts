import { Module, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplatesModule } from './templates/templates.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host:
          configService.get<string>('PGHOST') ||
          configService.get<string>('DB_HOST') ||
          'localhost',
        port: parseInt(
          configService.get<string>('PGPORT') ||
            configService.get<string>('DB_PORT') ||
            '5432',
          10,
        ),
        username:
          configService.get<string>('PGUSER') ||
          configService.get<string>('DB_USERNAME') ||
          'postgres',
        password:
          configService.get<string>('PGPASSWORD') ||
          configService.get<string>('DB_PASSWORD') ||
          'postgres',
        database:
          configService.get<string>('PGDATABASE') ||
          configService.get<string>('DB_NAME') ||
          'template_service',
        autoLoadEntities: true,
        synchronize: true, // Consider setting to false in production and using migrations
      }),
    }),
    TemplatesModule,
    AuthModule,
  ],
})
export class AppModule {}

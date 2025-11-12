import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesModule } from './templates/templates.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'template_user',
      password: 'template_password',
      database: 'template_service_db',
      autoLoadEntities: true,
      synchronize: true, // very important
    }),
    TemplatesModule,
    AuthModule,
  ],
})
export class AppModule {}

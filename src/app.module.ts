import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { WordModule } from './word/word.module';
import { AuthModule } from './auth/auth.module';
import { SetModule } from './set/set.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: false,
      logging: true,
      logger: 'file',
      entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
      migrations: [`${__dirname}/../migrations/**/*{.ts,.js}`],
    }),
    UserModule,
    WordModule,
    AuthModule,
    SetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

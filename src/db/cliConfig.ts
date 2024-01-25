import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const postgresqlConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  logger: 'file',
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [`${__dirname}/../migrations/**/*{.ts,.js}`],
};

export default new DataSource(postgresqlConfig);

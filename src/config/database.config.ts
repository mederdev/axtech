import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class DatabaseConfig {
  static getConfig(): TypeOrmModuleOptions {
    const { DB_DATABASE } = process.env;

    if (DB_DATABASE) {
      return {
        type: 'sqlite',
        database: DB_DATABASE,
        synchronize: true,
        entities: [__dirname + '/../**/**/entities/*.entity{.ts,.js}'],
      };
    } else {
      Logger.error('CONFIG ERROR (DATABASE): BAD ENVIRONMENT');
      process.exit();
    }
  }
}

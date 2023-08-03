import * as process from 'process';
import { Logger } from '@nestjs/common';

export class Config {
  static getPort() {
    const { PORT } = process.env;

    if (PORT) {
      return Number(PORT);
    } else {
      Logger.error('CONFIG ERROR (PORT): BAD ENVIRONMENT');
      process.exit();
    }
  }
}
